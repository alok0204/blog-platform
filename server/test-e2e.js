const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const res = await fetch(url, { ...options, headers });
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  return { status: res.status, headers: res.headers, data };
}

async function runTests() {
  console.log('====================================================');
  console.log('   INKWELL BLOG PLATFORM - FULL-STACK VERIFICATION  ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    return async () => {
      try {
        await fn();
        console.log(`  ✓ PASS: ${name}`);
        passed++;
      } catch (err) {
        console.error(`  ✗ FAIL: ${name} ->`, err.message);
        failed++;
      }
    };
  }

  // 1. Health check
  await test('Health check endpoint responds with ok', async () => {
    const res = await request('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'ok');
  })();

  // 2. Fetch categories & tags
  await test('Categories and tags can be listed publicly', async () => {
    const catRes = await request('/categories');
    assert.strictEqual(catRes.status, 200);
    assert(Array.isArray(catRes.data.categories));
    assert(catRes.data.categories.length > 0);

    const tagRes = await request('/tags');
    assert.strictEqual(tagRes.status, 200);
    assert(Array.isArray(tagRes.data.tags));
  })();

  // 3. User Registration (User 1 - Alice)
  const uniqueId = Date.now();
  const user1Email = `author_${uniqueId}@inkwell.com`;
  const user1Pass = 'SecurePass@123';
  let user1Token = null;
  let user1Id = null;

  await test('User 1 (Alice) registers successfully with strong password', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Alice Writer',
        email: user1Email,
        password: user1Pass,
      }),
    });
    assert.strictEqual(res.status, 201);
    assert(res.data.user);
    assert.strictEqual(res.data.user.email, user1Email);
    assert.strictEqual(res.data.user.role, 'USER');
    user1Id = res.data.user.id;

    // Extract cookie or login to get token
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: user1Email, password: user1Pass }),
    });
    assert.strictEqual(loginRes.status, 200);
    const cookieHeader = loginRes.headers.get('set-cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) user1Token = match[1];
    }
    assert(user1Token, 'Token should be returned in cookie');
  })();

  // 4. Session Persistence (/api/auth/me)
  await test('User 1 session persists with JWT Bearer header', async () => {
    const res = await request('/auth/me', {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.user.id, user1Id);
    assert.strictEqual(res.data.user.name, 'Alice Writer');
  })();

  // 5. User Registration (User 2 - Bob)
  const user2Email = `reader_${uniqueId}@inkwell.com`;
  const user2Pass = 'ReaderPass@123';
  let user2Token = null;
  let user2Id = null;

  await test('User 2 (Bob) registers successfully', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Bob Reader',
        email: user2Email,
        password: user2Pass,
      }),
    });
    assert.strictEqual(res.status, 201);
    user2Id = res.data.user.id;

    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: user2Email, password: user2Pass }),
    });
    assert.strictEqual(loginRes.status, 200);
    const cookieHeader = loginRes.headers.get('set-cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) user2Token = match[1];
    }
  })();

  // 6. User 1 creates a draft post
  let draftPostId = null;
  await test('User 1 creates a draft post', async () => {
    const res = await request('/posts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${user1Token}` },
      body: JSON.stringify({
        title: `Draft Post ${uniqueId}`,
        content: '<p>This is a draft post body that is not yet published.</p>',
        excerpt: 'Draft excerpt',
        status: 'DRAFT',
      }),
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.post.status, 'DRAFT');
    draftPostId = res.data.post.id;
  })();

  // 7. Verify Draft is hidden from public
  await test('Draft post is hidden from unauthenticated public listing', async () => {
    const res = await request('/posts');
    assert.strictEqual(res.status, 200);
    const found = res.data.posts.find((p) => p.id === draftPostId);
    assert.strictEqual(found, undefined, 'Draft post must not be in public posts');
  })();

  // 8. User 1 publishes the post
  let publishedPostSlug = null;
  await test('User 1 updates draft to PUBLISHED status', async () => {
    const res = await request(`/posts/${draftPostId}/publish`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.post.status, 'PUBLISHED');
    publishedPostSlug = res.data.post.slug;
  })();

  // 9. Verify Published post is visible publicly
  await test('Published post is accessible publicly by slug', async () => {
    const res = await request(`/posts/${publishedPostSlug}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.post.id, draftPostId);
    assert.strictEqual(res.data.post.status, 'PUBLISHED');
  })();

  // 10. Cross-User Authorization: User 2 cannot edit User 1 post
  await test('User 2 cannot edit User 1 post (Cross-user authorization)', async () => {
    const res = await request(`/posts/${draftPostId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${user2Token}` },
      body: JSON.stringify({ title: 'Hacked Title' }),
    });
    assert.strictEqual(res.status, 403);
  })();

  // 11. Comments: User 2 comments on User 1 post
  let commentId = null;
  await test('User 2 comments on published post via /api/posts/:postId/comments', async () => {
    const res = await request(`/posts/${draftPostId}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user2Token}` },
      body: JSON.stringify({ content: 'Great article Alice! Very informative.' }),
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.comment.postId, draftPostId);
    assert.strictEqual(res.data.comment.author.name, 'Bob Reader');
    commentId = res.data.comment.id;
  })();

  // 12. Public comments retrieval
  await test('Comments are publicly retrievable for published post', async () => {
    const res = await request(`/posts/${draftPostId}/comments`);
    assert.strictEqual(res.status, 200);
    assert(res.data.comments.length >= 1);
    const c = res.data.comments.find((item) => item.id === commentId);
    assert(c, 'Created comment should be found in comments list');
  })();

  // 13. Cross-User Authorization: User 1 cannot delete User 2 comment
  await test('User 1 cannot delete User 2 comment (Ownership protection)', async () => {
    const res = await request(`/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert.strictEqual(res.status, 403);
  })();

  // 14. Normal user cannot access Admin endpoints
  await test('Regular user cannot access Admin statistics (Role authorization)', async () => {
    const res = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert.strictEqual(res.status, 403);
  })();

  // 15. Admin setup and Admin operations
  let adminToken = null;
  await test('Admin account logs in and accesses admin stats & comment moderation', async () => {
    // Login as pre-seeded admin
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@inkwell.com', password: 'Demo@1234' }),
    });
    assert.strictEqual(loginRes.status, 200);
    assert.strictEqual(loginRes.data.user.role, 'ADMIN');

    const cookieHeader = loginRes.headers.get('set-cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/token=([^;]+)/);
      if (match) adminToken = match[1];
    }
    assert(adminToken);

    // Get admin stats
    const statsRes = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(statsRes.status, 200);
    assert(typeof statsRes.data.totalUsers === 'number');
    assert(typeof statsRes.data.totalPosts === 'number');

    // Admin moderates (deletes) comment
    const delRes = await request(`/admin/comments/${commentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(delRes.status, 200);
  })();

  // 16. Verify Comment was deleted
  await test('Deleted comment no longer appears in comments list', async () => {
    const res = await request(`/posts/${draftPostId}/comments`);
    assert.strictEqual(res.status, 200);
    const found = res.data.comments.find((c) => c.id === commentId);
    assert.strictEqual(found, undefined);
  })();

  // 17. User 1 deletes own post
  await test('User 1 deletes own post', async () => {
    const res = await request(`/posts/${draftPostId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user1Token}` },
    });
    assert.strictEqual(res.status, 200);

    // Verify it is gone
    const getRes = await request(`/posts/${publishedPostSlug}`);
    assert.strictEqual(getRes.status, 404);
  })();

  console.log('\n====================================================');
  console.log(`  SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
