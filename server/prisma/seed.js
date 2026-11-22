const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting INKWELL database seed...\n');

  // ─── 1. Create Users ──────────────────────────────────────
  const passwordHash = await bcrypt.hash('Demo@1234', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'demo@inkwell.com' },
    update: {},
    create: {
      name: 'Alok Vishwas',
      email: 'demo@inkwell.com',
      passwordHash,
      role: 'USER',
      bio: 'B.Tech CSE student and aspiring full-stack developer. Building INKWELL as part of Thiranex internship. (Demo)',
      avatarUrl: null,
    },
  });
  console.log(`✅ User created: ${user1.name} (${user1.email})`);

  const user2 = await prisma.user.upsert({
    where: { email: 'sarah@inkwell.com' },
    update: {},
    create: {
      name: 'Sarah Chen',
      email: 'sarah@inkwell.com',
      passwordHash,
      role: 'USER',
      bio: 'Tech enthusiast and writer. Loves exploring new frameworks and sharing knowledge. (Demo)',
      avatarUrl: null,
    },
  });
  console.log(`✅ User created: ${user2.name} (${user2.email})`);

  // ─── 2. Create Categories ─────────────────────────────────
  const categoryData = [
    { name: 'Technology', slug: 'technology' },
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Programming', slug: 'programming' },
    { name: 'Design', slug: 'design' },
    { name: 'Career', slug: 'career' },
    { name: 'Tutorial', slug: 'tutorial' },
  ];

  const categories = {};
  for (const cat of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = category;
    console.log(`✅ Category created: ${category.name}`);
  }

  // ─── 3. Create Tags ───────────────────────────────────────
  const tagData = [
    { name: 'React', slug: 'react' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'CSS', slug: 'css' },
    { name: 'Database', slug: 'database' },
    { name: 'API', slug: 'api' },
  ];

  const tags = {};
  for (const t of tagData) {
    const tag = await prisma.tag.upsert({
      where: { slug: t.slug },
      update: {},
      create: t,
    });
    tags[t.slug] = tag;
    console.log(`✅ Tag created: ${tag.name}`);
  }

  // ─── 4. Create Posts ───────────────────────────────────────
  const now = new Date();
  const daysAgo = (d) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000);

  const postsData = [
    {
      title: 'Understanding React Hooks: A Comprehensive Guide',
      slug: 'understanding-react-hooks-a-comprehensive-guide',
      excerpt: 'Deep dive into React Hooks — learn how useState, useEffect, useContext, and custom hooks can simplify your component logic and replace class-based patterns.',
      content: `<h2>What Are React Hooks?</h2>
<p>React Hooks were introduced in React 16.8 as a way to use state and other React features without writing class components. Before hooks, if you wanted to manage state or perform side effects in a component, you had to convert it to a class component. Hooks changed this paradigm entirely, allowing function components to be just as powerful as their class-based counterparts.</p>

<p>The most commonly used hooks are <code>useState</code> and <code>useEffect</code>. The <code>useState</code> hook lets you add state variables to function components. It returns an array with two elements: the current state value and a function to update it. This simple API replaced the need for <code>this.state</code> and <code>this.setState</code> in class components, making code more concise and easier to reason about.</p>

<h2>The useEffect Hook</h2>
<p>The <code>useEffect</code> hook serves the same purpose as <code>componentDidMount</code>, <code>componentDidUpdate</code>, and <code>componentWillUnmount</code> combined. It lets you perform side effects in function components — things like data fetching, setting up subscriptions, or manually changing the DOM. By default, effects run after every render, but you can control when they re-run by passing a dependency array as the second argument.</p>

<p>One of the most powerful aspects of <code>useEffect</code> is its cleanup mechanism. By returning a function from your effect, you can specify how to clean up after it. This is perfect for unsubscribing from event listeners, cancelling API requests, or clearing timers. The cleanup function runs before the component unmounts and before re-running the effect due to dependency changes.</p>

<h2>Building Custom Hooks</h2>
<p>Custom hooks are one of the most elegant patterns in React. They allow you to extract component logic into reusable functions. A custom hook is simply a JavaScript function whose name starts with "use" and that may call other hooks. For example, you might create a <code>useLocalStorage</code> hook that syncs state with localStorage, or a <code>useFetch</code> hook that handles data fetching with loading and error states.</p>

<p>The beauty of custom hooks is that they let you share stateful logic between components without changing the component hierarchy. Unlike render props or higher-order components, hooks don't add extra nodes to your component tree. Each call to a hook gets its own isolated state, so you can use the same custom hook multiple times in a single component without any conflicts.</p>

<h2>Best Practices</h2>
<p>When working with hooks, there are several important rules to follow. First, only call hooks at the top level of your component or custom hook — never inside loops, conditions, or nested functions. This ensures that hooks are called in the same order each time a component renders, which is essential for React to correctly preserve state between re-renders. Second, only call hooks from React function components or custom hooks, never from regular JavaScript functions.</p>

<p>Performance optimization with hooks involves using <code>useMemo</code> and <code>useCallback</code> to memoize expensive computations and callback functions respectively. However, premature optimization can make code harder to read without meaningful performance gains. Profile your application first, then optimize the specific bottlenecks you identify. The React DevTools Profiler is an excellent tool for identifying components that re-render unnecessarily.</p>`,
      coverImage: null,
      status: 'PUBLISHED',
      authorId: user1.id,
      categoryId: categories['web-development'].id,
      publishedAt: daysAgo(2),
      tagSlugs: ['react', 'javascript'],
    },
    {
      title: 'Building RESTful APIs with Node.js and Express',
      slug: 'building-restful-apis-with-nodejs-and-express',
      excerpt: 'Learn how to design and implement production-ready RESTful APIs using Node.js and Express, covering routing, middleware, error handling, and authentication.',
      content: `<h2>Introduction to RESTful API Design</h2>
<p>REST (Representational State Transfer) is an architectural style that defines a set of constraints for creating web services. RESTful APIs use HTTP methods explicitly, are stateless, and expose directory-structure-like URIs. When building APIs with Node.js and Express, understanding REST principles is crucial for creating services that are intuitive, scalable, and maintainable.</p>

<p>Express.js is the most popular web application framework for Node.js. It provides a robust set of features for building web and mobile applications, including powerful routing, middleware support, and template engine integration. Its minimalist, unopinionated design gives developers the freedom to structure their applications as they see fit while providing essential tools out of the box.</p>

<h2>Structuring Your Express Application</h2>
<p>A well-structured Express application separates concerns into distinct layers. The routes layer handles incoming HTTP requests and delegates to the appropriate controller logic. The controller layer contains the business logic for processing requests and generating responses. The model layer interacts with the database and defines data schemas. This separation makes the codebase easier to test, maintain, and scale as the application grows.</p>

<p>Middleware functions are the backbone of Express applications. They have access to the request object, the response object, and the next middleware function in the application's request-response cycle. Middleware can execute code, modify request and response objects, end the request-response cycle, or call the next middleware. Common middleware includes body parsers for handling JSON and form data, CORS handlers for cross-origin requests, and authentication middleware for protecting routes.</p>

<h2>Error Handling and Validation</h2>
<p>Robust error handling is essential for production APIs. Express supports centralized error handling through error-handling middleware — functions with four parameters (err, req, res, next). By creating a global error handler, you can ensure consistent error response formats across your entire API. It is important to distinguish between operational errors (like validation failures or not-found resources) and programming errors (like null reference exceptions), handling each type appropriately.</p>

<p>Input validation should happen at the API boundary before data reaches your business logic. Libraries like express-validator or Joi provide declarative validation schemas that make it easy to validate request bodies, query parameters, and URL parameters. Always validate and sanitize user input to prevent injection attacks, data corruption, and unexpected behavior. Return clear, actionable error messages that help API consumers understand what went wrong and how to fix it.</p>

<h2>Authentication and Security</h2>
<p>Securing your API involves multiple layers of protection. JSON Web Tokens (JWT) are a popular choice for stateless authentication. After a user logs in, the server generates a signed token containing the user's identity and permissions. The client includes this token in subsequent requests, and the server verifies it without needing to store session state. Combine JWT with HTTPS, rate limiting, and input sanitization for a comprehensive security strategy.</p>

<p>Additional security measures include using the Helmet middleware to set various HTTP security headers, implementing rate limiting to prevent brute-force attacks, and using CORS to control which origins can access your API. Always hash passwords with a strong algorithm like bcrypt before storing them, and never log or expose sensitive data in error responses. Regular security audits and dependency updates are also essential practices for maintaining a secure API.</p>`,
      coverImage: null,
      status: 'PUBLISHED',
      authorId: user1.id,
      categoryId: categories['programming'].id,
      publishedAt: daysAgo(8),
      tagSlugs: ['nodejs', 'api', 'javascript'],
    },
    {
      title: 'Mastering CSS Grid Layout for Modern Web Design',
      slug: 'mastering-css-grid-layout-for-modern-web-design',
      excerpt: 'A practical guide to CSS Grid — learn how to create complex, responsive layouts with minimal code using the most powerful layout system in CSS.',
      content: `<h2>Why CSS Grid Changes Everything</h2>
<p>CSS Grid Layout is a two-dimensional layout system designed specifically for creating complex web layouts. Unlike Flexbox, which is primarily one-dimensional (working along either a row or column axis), Grid lets you work with both rows and columns simultaneously. This makes it ideal for creating page-level layouts, card grids, and any design that requires precise control over both dimensions.</p>

<p>Before CSS Grid, creating complex layouts often required hacks involving floats, positioning, tables, or deeply nested Flexbox containers. Grid eliminates these workarounds by providing a native, purpose-built layout system. You define a grid on the container element using <code>display: grid</code>, then place child elements into specific cells or areas of that grid. The result is cleaner, more maintainable code that accurately expresses your design intent.</p>

<h2>Defining Grid Tracks and Areas</h2>
<p>Grid tracks are the rows and columns that make up your grid. You define them using <code>grid-template-columns</code> and <code>grid-template-rows</code>. The <code>fr</code> unit is unique to Grid and represents a fraction of the available space. For example, <code>grid-template-columns: 1fr 2fr 1fr</code> creates three columns where the middle column is twice as wide as the others. You can mix units freely — <code>200px 1fr 1fr</code> gives you a fixed sidebar with two flexible content columns.</p>

<p>Grid template areas provide a visual way to define your layout. By naming areas of your grid and assigning elements to them, you create a layout that reads almost like ASCII art in your CSS. The <code>grid-template-areas</code> property lets you write something like <code>"header header header" "sidebar content content" "footer footer footer"</code>, which is immediately readable and understandable. Each child element is then placed using <code>grid-area: header</code> or <code>grid-area: sidebar</code>.</p>

<h2>Responsive Grids Without Media Queries</h2>
<p>One of Grid's superpowers is the ability to create responsive layouts without any media queries. The <code>auto-fill</code> and <code>auto-fit</code> keywords, combined with the <code>minmax()</code> function, let the browser automatically determine how many columns fit in the available space. The pattern <code>grid-template-columns: repeat(auto-fill, minmax(300px, 1fr))</code> creates as many 300px-minimum columns as will fit, expanding them equally to fill any remaining space.</p>

<p>The difference between <code>auto-fill</code> and <code>auto-fit</code> is subtle but important. <code>auto-fill</code> creates as many tracks as possible, even if some are empty. <code>auto-fit</code> collapses empty tracks to zero width, allowing filled tracks to stretch and take up the remaining space. For most responsive card layouts, <code>auto-fit</code> produces the desired behavior, while <code>auto-fill</code> is useful when you want to maintain consistent track sizes regardless of how many items are present.</p>

<h2>Combining Grid with Flexbox</h2>
<p>Grid and Flexbox are complementary, not competing tools. A common pattern is to use Grid for the overall page layout (header, sidebar, main content, footer) and Flexbox for the components within those areas (navigation bars, card content, button groups). Grid excels at defining the macro-level structure, while Flexbox is perfect for aligning and distributing items within a single row or column.</p>

<p>When deciding which to use, consider whether you need to control layout in one dimension or two. If you are aligning items along a single axis — like centering content vertically, spacing out navigation links, or creating a row of cards — Flexbox is the right choice. If you need to align items in both rows and columns simultaneously — like a dashboard layout, a photo gallery, or a form with aligned labels and inputs — Grid is the better tool. Mastering both gives you the full toolkit needed to build any modern web layout efficiently.</p>`,
      coverImage: null,
      status: 'PUBLISHED',
      authorId: user1.id,
      categoryId: categories['design'].id,
      publishedAt: daysAgo(15),
      tagSlugs: ['css', 'javascript'],
    },
    {
      title: 'Getting Started with PostgreSQL and Prisma ORM',
      slug: 'getting-started-with-postgresql-and-prisma-orm',
      excerpt: 'Discover how to use Prisma ORM with PostgreSQL to build type-safe database queries, manage migrations, and streamline your backend development workflow.',
      content: `<h2>Why Prisma and PostgreSQL?</h2>
<p>PostgreSQL is one of the most advanced open-source relational databases available. It offers features like complex queries, foreign keys, triggers, updatable views, transactional integrity, and multiversion concurrency control. When paired with Prisma ORM, you get a modern, type-safe way to interact with your database that significantly reduces the boilerplate code associated with traditional SQL queries or older ORMs.</p>

<p>Prisma takes a fundamentally different approach compared to traditional ORMs like Sequelize or TypeORM. Instead of defining models in JavaScript or TypeScript classes, you define your data model in a Prisma schema file using Prisma's declarative modeling language. From this schema, Prisma generates a fully typed client library that provides autocomplete, compile-time error checking, and an intuitive API for database operations.</p>

<h2>Setting Up Your Prisma Project</h2>
<p>Getting started with Prisma involves initializing it in your project with <code>npx prisma init</code>, which creates a <code>prisma</code> directory with a <code>schema.prisma</code> file and a <code>.env</code> file for your database connection string. The schema file is where you define your data models, their fields, relations, and any indexes or constraints. Each model maps to a database table, and Prisma handles creating the corresponding SQL migration files.</p>

<p>Prisma Migrate is the tool for managing database schema changes. When you modify your schema and run <code>npx prisma migrate dev</code>, Prisma compares your schema to the current database state, generates a SQL migration file, and applies it. This gives you a complete history of all schema changes, making it easy to collaborate with team members and deploy changes to production. Each migration is stored as a SQL file that can be reviewed, edited, and version-controlled.</p>

<h2>Writing Queries with Prisma Client</h2>
<p>Prisma Client provides an expressive, chainable API for database operations. Basic CRUD operations are straightforward: <code>prisma.user.create()</code>, <code>prisma.user.findMany()</code>, <code>prisma.user.update()</code>, and <code>prisma.user.delete()</code>. Each method accepts an object with options for filtering, sorting, pagination, and selecting specific fields. The <code>include</code> option lets you eagerly load related data, while <code>select</code> lets you pick only the fields you need.</p>

<p>Advanced queries in Prisma support filtering with complex conditions using <code>where</code> clauses with operators like <code>contains</code>, <code>startsWith</code>, <code>gt</code>, <code>lt</code>, and logical operators like <code>AND</code>, <code>OR</code>, and <code>NOT</code>. Aggregation functions like <code>count</code>, <code>sum</code>, <code>avg</code>, <code>min</code>, and <code>max</code> are available through <code>prisma.model.aggregate()</code>. For operations that need to be atomic, Prisma provides transactions via <code>prisma.$transaction()</code>, ensuring that multiple database operations either all succeed or all fail.</p>

<h2>Relations and Best Practices</h2>
<p>Prisma handles database relations elegantly. One-to-many relations are defined by adding a relation field on both sides of the relation and specifying the foreign key with the <code>@relation</code> attribute. Many-to-many relations can be either implicit (Prisma manages the join table) or explicit (you define the join table as a model). Understanding how Prisma maps these relations to SQL helps you design efficient schemas and write performant queries.</p>

<p>Best practices for working with Prisma include keeping your Prisma Client instance as a singleton (creating one client and reusing it across your application), using <code>select</code> to fetch only the data you need (reducing bandwidth and improving performance), and leveraging Prisma's built-in pagination with <code>skip</code> and <code>take</code> for handling large datasets. Regularly running <code>npx prisma generate</code> after schema changes ensures your client types stay in sync, and using Prisma Studio (<code>npx prisma studio</code>) provides a visual interface for inspecting and editing your data during development.</p>`,
      coverImage: null,
      status: 'PUBLISHED',
      authorId: user2.id,
      categoryId: categories['tutorial'].id,
      publishedAt: daysAgo(5),
      tagSlugs: ['database', 'nodejs'],
    },
    {
      title: 'The Complete Guide to JavaScript Async/Await',
      slug: 'the-complete-guide-to-javascript-async-await',
      excerpt: 'Master asynchronous JavaScript — from callbacks and promises to async/await, error handling patterns, and common pitfalls to avoid in production code.',
      content: `<h2>The Evolution of Asynchronous JavaScript</h2>
<p>JavaScript's asynchronous programming model has evolved significantly over the years. It started with callbacks — functions passed as arguments to be executed after an asynchronous operation completes. While callbacks work for simple cases, they quickly lead to deeply nested code known as "callback hell" when multiple asynchronous operations depend on each other. This made code hard to read, debug, and maintain.</p>

<p>Promises were introduced in ES6 (ES2015) as a cleaner way to handle asynchronous operations. A Promise represents a value that may not be available yet but will be resolved at some point in the future. Promises can be chained using <code>.then()</code> and errors can be caught with <code>.catch()</code>, eliminating the deep nesting of callbacks. However, complex chains of promises can still become difficult to follow, especially when intermediate values need to be passed between steps.</p>

<h2>Understanding Async/Await</h2>
<p>Async/await, introduced in ES2017, is syntactic sugar built on top of Promises. It lets you write asynchronous code that looks and behaves like synchronous code. The <code>async</code> keyword marks a function as asynchronous, and the <code>await</code> keyword pauses execution until a Promise resolves. Under the hood, the JavaScript engine transforms async/await into Promise chains, but the developer experience is dramatically improved.</p>

<p>When you mark a function with <code>async</code>, it automatically returns a Promise. Inside an async function, you can use <code>await</code> before any expression that returns a Promise. The function execution pauses at each <code>await</code> until the Promise settles, then continues with the resolved value. This linear, top-to-bottom flow makes it easy to reason about the order of operations, handle errors with standard try/catch blocks, and debug with breakpoints.</p>

<h2>Error Handling Patterns</h2>
<p>Error handling with async/await uses the familiar try/catch syntax from synchronous JavaScript. Wrap your await calls in a try block and handle errors in the catch block. This is a significant improvement over Promise chains, where forgetting a <code>.catch()</code> could lead to unhandled Promise rejections. With try/catch, error handling is explicit and follows the same patterns developers are accustomed to from synchronous code.</p>

<p>For more granular error handling, you can wrap individual await statements in separate try/catch blocks or create wrapper functions that return a tuple of [error, result]. Another pattern is to let errors propagate up to a centralized error handler, which is particularly useful in Express middleware. The key is to be intentional about which errors you handle locally and which you let propagate, ensuring that no error goes unhandled while keeping your code clean and readable.</p>

<h2>Common Pitfalls and Advanced Patterns</h2>
<p>One of the most common mistakes with async/await is running asynchronous operations sequentially when they could run in parallel. If you have two independent API calls, awaiting them one after the other doubles the total time. Instead, use <code>Promise.all()</code> to run them concurrently: <code>const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()])</code>. This simple change can dramatically improve performance in functions that make multiple independent asynchronous calls.</p>

<p>Other advanced patterns include <code>Promise.allSettled()</code> for running multiple promises and handling both successes and failures, <code>Promise.race()</code> for implementing timeouts, and async iterators with <code>for await...of</code> for processing streams of asynchronous data. When working with loops, be careful about using <code>await</code> inside a <code>forEach</code> — it won't work as expected because <code>forEach</code> doesn't await the callback. Instead, use a standard <code>for...of</code> loop or <code>Promise.all()</code> with <code>map()</code> for concurrent processing.</p>`,
      coverImage: null,
      status: 'PUBLISHED',
      authorId: user2.id,
      categoryId: categories['programming'].id,
      publishedAt: daysAgo(12),
      tagSlugs: ['javascript', 'nodejs'],
    },
    {
      title: 'Landing Your First Developer Job: A Practical Roadmap',
      slug: 'landing-your-first-developer-job-a-practical-roadmap',
      excerpt: 'A step-by-step guide for aspiring developers — learn how to build a strong portfolio, prepare for technical interviews, and stand out in the competitive job market.',
      content: `<h2>Building a Strong Foundation</h2>
<p>Breaking into software development requires more than just knowing how to code. While technical skills are essential, the path to your first developer job involves a combination of continuous learning, practical project experience, effective networking, and strategic job searching. The good news is that the demand for developers continues to grow, and there are more resources available than ever to help you prepare.</p>

<p>Start by mastering the fundamentals of web development: HTML, CSS, and JavaScript. These three technologies form the foundation of the web, and a solid understanding of them will serve you regardless of which framework or library you eventually specialize in. Don't rush to learn React or Angular before you understand how the DOM works, how CSS layouts function, and how JavaScript handles asynchronous operations. Spend time building projects with vanilla technologies before adding abstractions on top.</p>

<h2>Creating a Portfolio That Stands Out</h2>
<p>Your portfolio is your most powerful tool in the job search. It demonstrates your skills more effectively than any resume bullet point. Focus on building three to five complete, deployed projects that showcase different aspects of your abilities. Each project should solve a real problem, have clean and well-documented code, and be deployed where hiring managers can see it in action. Quality matters far more than quantity — three polished projects are better than ten half-finished ones.</p>

<p>When choosing portfolio projects, go beyond tutorial clones. Build something that reflects your interests or solves a problem you've personally encountered. A blog platform, a task management app, or an e-commerce site are good starting points, but add your own features and design decisions. Write a detailed README for each project explaining the technology choices, challenges you overcame, and what you learned. This demonstrates not just coding ability but also communication skills and problem-solving thinking.</p>

<h2>Preparing for Technical Interviews</h2>
<p>Technical interviews typically include coding challenges, system design discussions, and behavioral questions. For coding challenges, practice on platforms like LeetCode, HackerRank, or CodeSignal, focusing on data structures (arrays, linked lists, trees, hash maps) and algorithms (sorting, searching, dynamic programming). You don't need to solve every hard problem — focus on understanding patterns and being able to explain your thought process clearly.</p>

<p>System design questions assess your ability to think about scalability, reliability, and trade-offs. Even for junior roles, you should understand basic concepts like client-server architecture, databases versus caches, load balancing, and API design. Practice explaining how you would design systems like a URL shortener, a chat application, or a news feed. The goal isn't perfection but demonstrating that you can think systematically about complex problems and communicate your ideas effectively.</p>

<h2>Networking and Job Search Strategy</h2>
<p>Networking remains one of the most effective ways to find job opportunities. Attend local meetups, contribute to open-source projects, and engage with developer communities on Twitter, Discord, and LinkedIn. Don't just consume content — share your learning journey, write about what you're building, and help others who are earlier in their path. Many developers have found their first jobs through connections made in these communities rather than through traditional job applications.</p>

<p>When applying for jobs, tailor your resume and cover letter for each position. Highlight the specific technologies and experiences that match the job description. Apply to a mix of positions — not just your dream companies but also startups, agencies, and companies in industries you might not have considered. Consider internships and apprenticeships as stepping stones. Keep a spreadsheet to track your applications, follow-ups, and outcomes. The job search is a numbers game, but it's also a skills game — each interview makes you better at the next one.</p>`,
      coverImage: null,
      status: 'PUBLISHED',
      authorId: user2.id,
      categoryId: categories['career'].id,
      publishedAt: daysAgo(20),
      tagSlugs: ['javascript', 'react'],
    },
  ];

  const createdPosts = [];

  for (const postData of postsData) {
    const { tagSlugs, ...data } = postData;

    // Check if post already exists
    const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
    if (existing) {
      console.log(`⏭️  Post already exists: ${data.title}`);
      createdPosts.push(existing);
      continue;
    }

    const post = await prisma.post.create({ data });

    // Connect tags
    if (tagSlugs && tagSlugs.length > 0) {
      for (const slug of tagSlugs) {
        const tag = tags[slug];
        if (tag) {
          await prisma.postTag.upsert({
            where: { postId_tagId: { postId: post.id, tagId: tag.id } },
            update: {},
            create: { postId: post.id, tagId: tag.id },
          });
        }
      }
    }

    createdPosts.push(post);
    console.log(`✅ Post created: ${post.title}`);
  }

  // ─── 5. Create Comments ───────────────────────────────────
  const commentsData = [
    {
      content: 'This is an excellent introduction to React Hooks! The section on custom hooks really helped me understand how to extract reusable logic from my components. I have been struggling with that pattern for a while.',
      authorId: user2.id,
      postId: createdPosts[0].id,
    },
    {
      content: 'Great explanation of useEffect cleanup! I had a memory leak in my app because I forgot to clean up an event listener, and this article helped me understand why the cleanup function is so important.',
      authorId: user2.id,
      postId: createdPosts[0].id,
    },
    {
      content: 'The section on middleware really clarified how Express processes requests. I was confused about the order of middleware execution, but the pipeline analogy makes it much clearer. Thanks for sharing!',
      authorId: user2.id,
      postId: createdPosts[1].id,
    },
    {
      content: 'I have been using Flexbox for everything, but after reading this I realize Grid is so much better for page-level layouts. The auto-fill/auto-fit tip is a game changer for responsive card grids!',
      authorId: user1.id,
      postId: createdPosts[2].id,
    },
    {
      content: 'Prisma has completely changed how I work with databases. The type safety alone is worth the switch from raw SQL. This guide covers all the essentials really well.',
      authorId: user1.id,
      postId: createdPosts[3].id,
    },
    {
      content: 'The tip about Promise.all for parallel async operations was eye-opening! I had several API calls running sequentially that I was able to parallelize after reading this, cutting my response time in half.',
      authorId: user1.id,
      postId: createdPosts[4].id,
    },
    {
      content: 'As someone who just landed their first dev job, I can confirm that having a strong portfolio made all the difference. The interviewer spent most of the time asking about my projects rather than algorithm questions.',
      authorId: user1.id,
      postId: createdPosts[5].id,
    },
    {
      content: 'Really helpful advice about networking. I joined a local JavaScript meetup and made connections that eventually led to referrals at two companies. Building in public and sharing your journey truly works!',
      authorId: user2.id,
      postId: createdPosts[5].id,
    },
  ];

  let commentsCreated = 0;
  for (const commentData of commentsData) {
    // Avoid exact duplicate comments on the same post by the same author
    const existing = await prisma.comment.findFirst({
      where: {
        content: commentData.content,
        authorId: commentData.authorId,
        postId: commentData.postId,
      },
    });

    if (!existing) {
      await prisma.comment.create({ data: commentData });
      commentsCreated++;
    }
  }
  console.log(`✅ Comments created: ${commentsCreated}`);

  console.log('\n🎉 INKWELL database seed completed successfully!');
  console.log('   Demo credentials:');
  console.log('   - Email: demo@inkwell.com | Password: Demo@1234');
  console.log('   - Email: sarah@inkwell.com | Password: Demo@1234');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
