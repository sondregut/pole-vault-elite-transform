<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pole Vault Tracker - Track Every Jump</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css"
      rel="stylesheet"
    />
    <script src="https://cdn.tailwindcss.com/3.4.16"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: { primary: "#3D70D9", secondary: "#1E293B" },
            borderRadius: {
              none: "0px",
              sm: "4px",
              DEFAULT: "8px",
              md: "12px",
              lg: "16px",
              xl: "20px",
              "2xl": "24px",
              "3xl": "32px",
              full: "9999px",
              button: "8px",
            },
          },
        },
      };
    </script>
    <style>
      :where([class^="ri-"])::before { content: "\f3c2"; }
      body {
      font-family: 'Inter', sans-serif;
      }
      input:focus {
      outline: none;
      }
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
      }
    </style>
  </head>
  <body class="bg-gray-50 text-gray-800">
    <!-- Navigation -->
    <nav
      class="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-95 z-50 px-4 sm:px-6 py-4"
    >
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <img
          src="https://static.readdy.ai/image/cac8dfb8ebb3b9722f729c6a17eb3793/8b5fa16a1c7dd4713027fd15b2e680b1.png"
          alt="Pole Vault Tracker Logo"
          class="h-8"
        />
        <div class="hidden md:flex items-center space-x-8">
          <a
            href="#features"
            class="text-gray-300 hover:text-white transition-colors"
            >Features</a
          >
          <a
            href="#preview"
            class="text-gray-300 hover:text-white transition-colors"
            >Preview</a
          >
          <a
            href="#pricing"
            class="text-gray-300 hover:text-white transition-colors"
            >Pricing</a
          >
          <a href="#" class="text-gray-300 hover:text-white transition-colors"
            >Support</a
          >
        </div>
        <div class="hidden md:flex items-center space-x-4">
          <a href="#" class="text-gray-300 hover:text-white transition-colors"
            >Log in</a
          >
          <a
            href="#"
            class="bg-primary text-white px-5 py-2 !rounded-button font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap"
            >Sign up</a
          >
        </div>
        <button
          id="mobileMenuButton"
          class="md:hidden text-white w-10 h-10 flex items-center justify-center"
        >
          <i class="ri-menu-line ri-lg"></i>
        </button>
      </div>
      <!-- Mobile Menu -->
      <div
        id="mobileMenu"
        class="hidden md:hidden fixed inset-x-0 top-[72px] bg-gray-900 bg-opacity-95"
      >
        <div class="px-4 py-6 space-y-4">
          <a
            href="#features"
            class="block text-gray-300 hover:text-white transition-colors py-2"
            >Features</a
          >
          <a
            href="#preview"
            class="block text-gray-300 hover:text-white transition-colors py-2"
            >Preview</a
          >
          <a
            href="#pricing"
            class="block text-gray-300 hover:text-white transition-colors py-2"
            >Pricing</a
          >
          <a
            href="#"
            class="block text-gray-300 hover:text-white transition-colors py-2"
            >Support</a
          >
          <div class="pt-4 space-y-4">
            <a
              href="#"
              class="block text-gray-300 hover:text-white transition-colors py-2"
              >Log in</a
            >
            <a
              href="#"
              class="block bg-primary text-white px-5 py-2 !rounded-button font-medium hover:bg-opacity-90 transition-colors text-center"
              >Sign up</a
            >
          </div>
        </div>
      </div>
    </nav>
    <!-- Hero Section -->
    <section
      class="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div class="absolute inset-0">
        <img
          src="https://static.readdy.ai/image/cac8dfb8ebb3b9722f729c6a17eb3793/a374527979d3a03e895e20d6000c5c41.jpeg"
          class="w-full h-full object-cover"
          alt="Hero Background"
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50"
        ></div>
      </div>
      <div
        class="max-w-7xl mx-auto px-6 relative flex items-center justify-center min-h-screen"
      >
        <div class="w-full lg:w-3/4 mx-auto text-center space-y-6 sm:space-y-8">
          <div class="space-y-4">
            <h1
              class="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight"
            >
              Track Every Jump. <span class="text-primary">Level Up</span> Your
              Vault.
            </h1>
            <p
              class="text-lg sm:text-xl text-gray-200 leading-relaxed px-4 sm:px-0"
            >
              A powerful tool for pole vaulters to log every session, track
              poles, analyze jumps, and improve consistently.
            </p>
          </div>
          <div class="space-y-6">
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://apps.apple.com"
                target="_blank"
                class="bg-black text-white px-8 py-4 !rounded-button font-medium text-lg hover:bg-opacity-90 transition-all transform hover:scale-105 whitespace-nowrap text-center inline-flex items-center justify-center gap-3"
              >
                <i class="ri-apple-fill text-2xl"></i>
                <div class="flex flex-col items-start leading-tight">
                  <span class="text-xs">Download on the</span>
                  <span class="text-base font-semibold">App Store</span>
                </div>
              </a>
            </div>
            <div
              class="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-gray-300 justify-center"
            >
              <a
                href="#preview"
                class="flex items-center gap-2 hover:text-white transition-colors"
              >
                <i class="ri-play-circle-line"></i>
                <span>Watch Demo</span>
              </a>
              <div class="flex items-center gap-8">
                <div class="flex items-center gap-2">
                  <i class="ri-shield-check-line text-primary"></i>
                  <span>Free Download</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="ri-bank-card-line text-primary"></i>
                  <span>In-App Purchases</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Features Section -->
    <section id="features" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Excel
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Our comprehensive toolkit helps you track, analyze, and improve
            every aspect of your pole vault training.
          </p>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <!-- Feature 1 -->
          <div
            class="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
            >
              <i class="ri-calendar-line ri-xl text-primary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Log Sessions</h3>
            <p class="text-gray-600">
              Keep track of every practice with detailed notes, weather
              conditions, and overall performance ratings.
            </p>
          </div>
          <!-- Feature 2 -->
          <div
            class="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
            >
              <i class="ri-run-line ri-xl text-primary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Record Jumps</h3>
            <p class="text-gray-600">
              Document height, pole used, approach distance, and technical notes
              for each attempt during training or competition.
            </p>
          </div>
          <!-- Feature 3 -->
          <div
            class="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
            >
              <i class="ri-book-open-line ri-xl text-primary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Training Library</h3>
            <p class="text-gray-600">
              Access a comprehensive collection of drills, workouts, and
              technical guides to enhance your training routine.
            </p>
          </div>
          <!-- Feature 4 -->
          <div
            class="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
            >
              <i class="ri-stack-line ri-xl text-primary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Pole Library</h3>
            <p class="text-gray-600">
              Manage your pole inventory with details on length, weight rating,
              and usage history for optimal equipment selection.
            </p>
          </div>
          <!-- Feature 5 -->
          <div
            class="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
            >
              <i class="ri-brain-line ri-xl text-primary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Session Summary</h3>
            <p class="text-gray-600">
              Get intelligent insights and analytics after each practice to
              identify patterns and areas for improvement.
            </p>
          </div>
          <!-- Feature 6 -->
          <div
            class="bg-gray-50 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              class="w-14 h-14 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
            >
              <i class="ri-camera-line ri-xl text-primary"></i>
            </div>
            <h3 class="text-xl font-semibold mb-3">Upload Media</h3>
            <p class="text-gray-600">
              Attach videos and photos to your jumps for visual reference and
              technical analysis of your form.
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- App Preview Section -->
    <section id="preview" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col lg:flex-row items-center gap-12">
          <div class="lg:w-1/2">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">
              Your Complete Vault Journey in One App
            </h2>
            <p class="text-xl text-gray-600 mb-8">
              Pole Vault Tracker gives you the tools to document, analyze, and
              improve your performance with precision and ease.
            </p>
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <i class="ri-check-line ri-lg text-primary"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-1">
                    Personalized Analytics
                  </h3>
                  <p class="text-gray-600">
                    Track your progress over time with custom reports and
                    visualizations of your performance metrics.
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <i class="ri-check-line ri-lg text-primary"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-1">
                    Coach Collaboration
                  </h3>
                  <p class="text-gray-600">
                    Share your data with coaches for remote feedback and
                    guidance on technique improvements.
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                >
                  <i class="ri-check-line ri-lg text-primary"></i>
                </div>
                <div>
                  <h3 class="text-lg font-semibold mb-1">
                    Competition Preparation
                  </h3>
                  <p class="text-gray-600">
                    Set goals, track meet performance, and compare results
                    against your training data.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="lg:w-1/2">
            <div class="relative">
              <div
                class="absolute -top-4 -left-4 w-64 h-64 bg-primary bg-opacity-10 rounded-full filter blur-3xl"
              ></div>
              <div
                class="absolute -bottom-8 -right-8 w-80 h-80 bg-secondary bg-opacity-10 rounded-full filter blur-3xl"
              ></div>
              <div class="relative bg-white p-4 rounded-2xl shadow-xl">
                <img
                  src="https://static.readdy.ai/image/cac8dfb8ebb3b9722f729c6a17eb3793/5723b203a3b26de4f581af0a6e0e3a89.png"
                  alt="Pole Vault Tracker App Interface"
                  class="w-full h-auto rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- How It Works Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with Pole Vault Tracker in three simple steps
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <!-- Step 1 -->
          <div class="relative">
            <div
              class="absolute -left-4 top-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl"
            >
              1
            </div>
            <div class="pt-2 pl-10">
              <div class="bg-gray-50 p-8 rounded-lg h-full">
                <div
                  class="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
                >
                  <i class="ri-user-add-line ri-2x text-primary"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4">Create Your Profile</h3>
                <p class="text-gray-600">
                  Set up your personal profile with your goals, current
                  performance metrics, and preferred equipment specifications.
                </p>
              </div>
            </div>
          </div>
          <!-- Step 2 -->
          <div class="relative">
            <div
              class="absolute -left-4 top-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl"
            >
              2
            </div>
            <div class="pt-2 pl-10">
              <div class="bg-gray-50 p-8 rounded-lg h-full">
                <div
                  class="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
                >
                  <i class="ri-calendar-check-line ri-2x text-primary"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4">Log Your Sessions</h3>
                <p class="text-gray-600">
                  Record your training sessions, including jump heights, pole
                  selections, and technical notes. Upload videos for form
                  analysis.
                </p>
              </div>
            </div>
          </div>
          <!-- Step 3 -->
          <div class="relative">
            <div
              class="absolute -left-4 top-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl"
            >
              3
            </div>
            <div class="pt-2 pl-10">
              <div class="bg-gray-50 p-8 rounded-lg h-full">
                <div
                  class="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-6"
                >
                  <i class="ri-line-chart-line ri-2x text-primary"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4">Track Progress</h3>
                <p class="text-gray-600">
                  Review your performance analytics, identify trends, and adjust
                  your training plan based on data-driven insights.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Additional Features -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-50 p-8 rounded-lg flex items-start gap-6">
            <div
              class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <i class="ri-team-line ri-lg text-primary"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Coach Integration</h3>
              <p class="text-gray-600">
                Share your progress with coaches who can provide remote feedback
                and adjust your training program in real-time.
              </p>
            </div>
          </div>
          <div class="bg-gray-50 p-8 rounded-lg flex items-start gap-6">
            <div
              class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <i class="ri-notification-4-line ri-lg text-primary"></i>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-2">Smart Reminders</h3>
              <p class="text-gray-600">
                Get personalized notifications for training sessions,
                competition preparation, and equipment maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Progress Tracking Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Track Your Progress Over Time
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Visualize your improvement with comprehensive analytics and
            performance trends.
          </p>
        </div>
        <div class="bg-gray-50 p-8 rounded-xl shadow-sm">
          <div id="performanceChart" class="w-full h-80"></div>
        </div>
      </div>
    </section>
    <!-- Testimonials Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            What Athletes Are Saying
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Join the community of pole vaulters who have transformed their
            training with our app.
          </p>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <!-- Testimonial 1 -->
          <div class="bg-white p-8 rounded-lg shadow-sm">
            <div class="flex items-center gap-1 text-yellow-400 mb-4">
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
            </div>
            <p class="text-gray-600 mb-6">
              "This app has completely changed how I approach my training. Being
              able to track every jump and see my progress over time has been
              invaluable for my development."
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="w-full h-full flex items-center justify-center bg-primary bg-opacity-20"
                >
                  <i class="ri-user-line ri-lg text-primary"></i>
                </div>
              </div>
              <div>
                <h4 class="font-semibold">Michael Richardson</h4>
                <p class="text-sm text-gray-500">College Athlete, 5.40m PB</p>
              </div>
            </div>
          </div>
          <!-- Testimonial 2 -->
          <div class="bg-white p-8 rounded-lg shadow-sm">
            <div class="flex items-center gap-1 text-yellow-400 mb-4">
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
            </div>
            <p class="text-gray-600 mb-6">
              "As a coach, this tool has revolutionized how I work with my
              athletes. The ability to share data, analyze videos, and track
              progress remotely has been a game-changer for our program."
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="w-full h-full flex items-center justify-center bg-primary bg-opacity-20"
                >
                  <i class="ri-user-line ri-lg text-primary"></i>
                </div>
              </div>
              <div>
                <h4 class="font-semibold">Jennifer Blackwell</h4>
                <p class="text-sm text-gray-500">
                  University Coach, 15+ Years Experience
                </p>
              </div>
            </div>
          </div>
          <!-- Testimonial 3 -->
          <div class="bg-white p-8 rounded-lg shadow-sm">
            <div class="flex items-center gap-1 text-yellow-400 mb-4">
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
            </div>
            <p class="text-gray-600 mb-6">
              "The pole inventory feature alone is worth it. I used to struggle
              keeping track of which poles worked best in different conditions,
              but now I have all that data at my fingertips."
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="w-full h-full flex items-center justify-center bg-primary bg-opacity-20"
                >
                  <i class="ri-user-line ri-lg text-primary"></i>
                </div>
              </div>
              <div>
                <h4 class="font-semibold">David Thompson</h4>
                <p class="text-sm text-gray-500">
                  High School Athlete, State Champion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Pricing Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your training needs
          </p>
          <button
            id="compareButton"
            class="mt-6 text-primary hover:text-primary/80 font-medium flex items-center gap-2 mx-auto transition-colors"
          >
            <i class="ri-table-line"></i>
            Compare All Features
          </button>
        </div>
        <!-- Feature Comparison Modal -->
        <div
          id="comparisonModal"
          class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden"
        >
          <div class="fixed inset-0 flex items-center justify-center p-4">
            <div
              class="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div
                class="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center"
              >
                <h3 class="text-2xl font-bold">Feature Comparison</h3>
                <button
                  id="closeModal"
                  class="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <i class="ri-close-line ri-2x"></i>
                </button>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-4 gap-4">
                  <div class="col-span-1"></div>
                  <div class="text-center font-semibold">Basic</div>
                  <div class="text-center font-semibold">Pro</div>
                  <div class="text-center font-semibold">Team</div>
                  <!-- Session Tracking -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Session Tracking
                  </div>
                  <div class="text-center p-3">Basic logging</div>
                  <div class="text-center p-3">Advanced logging</div>
                  <div class="text-center p-3">Advanced logging</div>
                  <!-- Pole Records -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Pole Records
                  </div>
                  <div class="text-center p-3">Up to 5 poles</div>
                  <div class="text-center p-3">Unlimited</div>
                  <div class="text-center p-3">Unlimited</div>
                  <!-- Analytics -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Analytics
                  </div>
                  <div class="text-center p-3">Basic</div>
                  <div class="text-center p-3">Advanced</div>
                  <div class="text-center p-3">Team dashboard</div>
                  <!-- Video Analysis -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Video Analysis
                  </div>
                  <div class="text-center p-3">
                    <i class="ri-close-line text-red-500"></i>
                  </div>
                  <div class="text-center p-3">
                    <i class="ri-check-line text-green-500"></i>
                  </div>
                  <div class="text-center p-3">
                    <i class="ri-check-line text-green-500"></i>
                  </div>
                  <!-- Coach Collaboration -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Coach Collaboration
                  </div>
                  <div class="text-center p-3">
                    <i class="ri-close-line text-red-500"></i>
                  </div>
                  <div class="text-center p-3">
                    <i class="ri-check-line text-green-500"></i>
                  </div>
                  <div class="text-center p-3">
                    <i class="ri-check-line text-green-500"></i>
                  </div>
                  <!-- Competition Management -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Competition Management
                  </div>
                  <div class="text-center p-3">
                    <i class="ri-close-line text-red-500"></i>
                  </div>
                  <div class="text-center p-3">Basic</div>
                  <div class="text-center p-3">Advanced</div>
                  <!-- Data Export -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Data Export
                  </div>
                  <div class="text-center p-3">CSV only</div>
                  <div class="text-center p-3">Multiple formats</div>
                  <div class="text-center p-3">Bulk export</div>
                  <!-- Support -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Support
                  </div>
                  <div class="text-center p-3">Community</div>
                  <div class="text-center p-3">Priority</div>
                  <div class="text-center p-3">Dedicated manager</div>
                  <!-- Storage -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Storage
                  </div>
                  <div class="text-center p-3">500MB</div>
                  <div class="text-center p-3">10GB</div>
                  <div class="text-center p-3">50GB</div>
                  <!-- Team Members -->
                  <div class="font-medium bg-gray-50 p-3 rounded-lg">
                    Team Members
                  </div>
                  <div class="text-center p-3">1</div>
                  <div class="text-center p-3">1</div>
                  <div class="text-center p-3">Up to 20</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Free Plan -->
          <div class="bg-gray-50 rounded-lg p-8 border-2 border-gray-100">
            <div class="text-center mb-8">
              <h3 class="text-xl font-semibold mb-2">Basic</h3>
              <div class="flex items-baseline justify-center">
                <span class="text-4xl font-bold">Free</span>
                <span class="text-gray-500 ml-2">/forever</span>
              </div>
              <p class="text-gray-600 mt-4">
                Perfect for individual athletes getting started
              </p>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Basic session logging</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Up to 5 pole records</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Basic performance tracking</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Community access</span>
              </li>
            </ul>
            <a
              href="#"
              class="block w-full text-center bg-white border-2 border-primary text-primary px-6 py-3 !rounded-button font-medium hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
              >Get Started</a
            >
          </div>
          <!-- Pro Plan -->
          <div
            class="bg-gray-50 rounded-lg p-8 border-2 border-primary relative transform scale-105"
          >
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span
                class="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium"
                >Most Popular</span
              >
            </div>
            <div class="text-center mb-8">
              <h3 class="text-xl font-semibold mb-2">Pro</h3>
              <div class="flex items-baseline justify-center">
                <span class="text-4xl font-bold">$9.99</span>
                <span class="text-gray-500 ml-2">/month</span>
              </div>
              <p class="text-gray-600 mt-4">For serious athletes and coaches</p>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Everything in Basic</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Unlimited pole records</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Advanced analytics</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Video analysis tools</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Coach collaboration</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Priority support</span>
              </li>
            </ul>
            <a
              href="#"
              class="block w-full text-center bg-primary text-white px-6 py-3 !rounded-button font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap"
              >Start Free Trial</a
            >
          </div>
          <!-- Team Plan -->
          <div class="bg-gray-50 rounded-lg p-8 border-2 border-gray-100">
            <div class="text-center mb-8">
              <h3 class="text-xl font-semibold mb-2">Team</h3>
              <div class="flex items-baseline justify-center">
                <span class="text-4xl font-bold">$29.99</span>
                <span class="text-gray-500 ml-2">/month</span>
              </div>
              <p class="text-gray-600 mt-4">For schools and training centers</p>
            </div>
            <ul class="space-y-4 mb-8">
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Everything in Pro</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Up to 20 athlete accounts</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Team analytics dashboard</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Competition management</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Bulk data export</span>
              </li>
              <li class="flex items-center gap-3">
                <i class="ri-check-line text-primary"></i>
                <span>Dedicated account manager</span>
              </li>
            </ul>
            <a
              href="#"
              class="block w-full text-center bg-white border-2 border-primary text-primary px-6 py-3 !rounded-button font-medium hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
              >Contact Sales</a
            >
          </div>
        </div>
        <div class="mt-16 bg-gray-50 rounded-lg p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center"
              >
                <i class="ri-secure-payment-line text-primary ri-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold">Secure Payment</h4>
                <p class="text-sm text-gray-600">256-bit SSL encryption</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center"
              >
                <i class="ri-calendar-line text-primary ri-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold">14-Day Trial</h4>
                <p class="text-sm text-gray-600">No credit card required</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center"
              >
                <i class="ri-customer-service-2-line text-primary ri-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold">24/7 Support</h4>
                <p class="text-sm text-gray-600">Live chat & email</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center"
              >
                <i class="ri-refresh-line text-primary ri-xl"></i>
              </div>
              <div>
                <h4 class="font-semibold">Cancel Anytime</h4>
                <p class="text-sm text-gray-600">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- CTA Section -->
    <section class="py-20 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to Transform Your Training?
        </h2>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Join thousands of athletes and coaches who are taking their pole vault
          performance to new heights.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <a
            href="#"
            class="bg-primary text-white px-8 py-4 !rounded-button font-medium text-lg hover:bg-opacity-90 transition-colors whitespace-nowrap"
            >Start Free Trial</a
          >
          <a
            href="#"
            class="border border-white text-white px-8 py-4 !rounded-button font-medium text-lg hover:bg-white hover:bg-opacity-10 transition-colors whitespace-nowrap"
            >See How It Works</a
          >
        </div>
        <p class="text-gray-400">
          No credit card required. 14-day free trial. Cancel anytime.
        </p>
      </div>
    </section>
    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-300 py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <img
              src="https://static.readdy.ai/image/cac8dfb8ebb3b9722f729c6a17eb3793/8b5fa16a1c7dd4713027fd15b2e680b1.png"
              alt="Pole Vault Tracker Logo"
              class="h-8 mb-4"
            />
            <p class="text-gray-400 mb-4">
              The ultimate companion for pole vaulters and coaches looking to
              elevate their performance.
            </p>
            <div class="flex space-x-4">
              <a
                href="https://www.instagram.com/polevaulttracker"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-white transition-colors w-10 h-10 flex items-center justify-center"
              >
                <i class="ri-instagram-line ri-lg"></i>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors w-10 h-10 flex items-center justify-center"
              >
                <i class="ri-twitter-x-line ri-lg"></i>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors w-10 h-10 flex items-center justify-center"
              >
                <i class="ri-facebook-circle-line ri-lg"></i>
              </a>
              <a
                href="#"
                class="text-gray-400 hover:text-white transition-colors w-10 h-10 flex items-center justify-center"
              >
                <i class="ri-youtube-line ri-lg"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Product</h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Features</a
                >
              </li>
              <li>
                <a
                  href="#pricing"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Pricing</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Testimonials</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                  >FAQ</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Resources</h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Blog</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Training Tips</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Support Center</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-gray-400 hover:text-white transition-colors"
                  >Contact Us</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h3 class="text-white font-semibold mb-4">Stay Updated</h3>
            <p class="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and training
              tips.
            </p>
            <div class="flex">
              <input
                type="email"
                placeholder="Your email address"
                class="bg-gray-700 text-white px-4 py-2 w-full border-none rounded-l-button focus:ring-0"
              />
              <button
                class="bg-primary text-white px-4 py-2 !rounded-r-button font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div
          class="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p class="text-gray-400">
            © 2025 Pole Vault Tracker. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-white transition-colors"
              >Privacy Policy</a
            >
            <a href="#" class="text-gray-400 hover:text-white transition-colors"
              >Terms of Service</a
            >
            <a href="#" class="text-gray-400 hover:text-white transition-colors"
              >Cookie Policy</a
            >
          </div>
        </div>
      </div>
    </footer>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.0/echarts.min.js"></script>
    <script>
      document.addEventListener("DOMContentLoaded", function () {
        // Feature Comparison Modal
        const compareButton = document.getElementById("compareButton");
        const comparisonModal = document.getElementById("comparisonModal");
        const closeModal = document.getElementById("closeModal");
        compareButton.addEventListener("click", () => {
          comparisonModal.classList.remove("hidden");
          document.body.style.overflow = "hidden";
        });
        closeModal.addEventListener("click", () => {
          comparisonModal.classList.add("hidden");
          document.body.style.overflow = "auto";
        });
        comparisonModal.addEventListener("click", (e) => {
          if (e.target === comparisonModal) {
            comparisonModal.classList.add("hidden");
            document.body.style.overflow = "auto";
          }
        });
        // Mobile Menu Toggle
        const mobileMenuButton = document.getElementById("mobileMenuButton");
        const mobileMenu = document.getElementById("mobileMenu");
        let isMenuOpen = false;
        mobileMenuButton.addEventListener("click", () => {
          isMenuOpen = !isMenuOpen;
          mobileMenu.classList.toggle("hidden");
          mobileMenuButton.innerHTML = isMenuOpen
            ? '<i class="ri-close-line ri-lg"></i>'
            : '<i class="ri-menu-line ri-lg"></i>';
        });
        // Close mobile menu when clicking on a link
        document.querySelectorAll("#mobileMenu a").forEach((link) => {
          link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            mobileMenuButton.innerHTML = '<i class="ri-menu-line ri-lg"></i>';
            isMenuOpen = false;
          });
        });
        const chartDom = document.getElementById("performanceChart");
        const myChart = echarts.init(chartDom);
        const option = {
          animation: false,
          tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            textStyle: {
              color: "#1f2937",
            },
          },
          legend: {
            data: ["Jump Height (m)", "Training Volume"],
            textStyle: {
              color: "#1f2937",
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            axisLine: {
              lineStyle: {
                color: "#94a3b8",
              },
            },
            axisLabel: {
              color: "#1f2937",
            },
          },
          yAxis: [
            {
              type: "value",
              name: "Height (m)",
              axisLine: {
                lineStyle: {
                  color: "#94a3b8",
                },
              },
              axisLabel: {
                color: "#1f2937",
                formatter: "{value} m",
              },
              splitLine: {
                lineStyle: {
                  color: "#e2e8f0",
                },
              },
            },
            {
              type: "value",
              name: "Volume",
              axisLine: {
                lineStyle: {
                  color: "#94a3b8",
                },
              },
              axisLabel: {
                color: "#1f2937",
                formatter: "{value}",
              },
              splitLine: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: "Jump Height (m)",
              type: "line",
              smooth: true,
              lineStyle: {
                width: 3,
                color: "rgba(87, 181, 231, 1)",
              },
              symbol: "none",
              areaStyle: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(87, 181, 231, 0.2)",
                    },
                    {
                      offset: 1,
                      color: "rgba(87, 181, 231, 0.05)",
                    },
                  ],
                },
              },
              data: [4.2, 4.3, 4.3, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0],
            },
            {
              name: "Training Volume",
              type: "bar",
              yAxisIndex: 1,
              itemStyle: {
                color: "rgba(141, 211, 199, 1)",
                borderRadius: [4, 4, 0, 0],
              },
              data: [12, 15, 18, 20, 22, 25, 28, 30, 32],
            },
          ],
        };
        myChart.setOption(option);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      });
    </script>
  </body>
</html>
