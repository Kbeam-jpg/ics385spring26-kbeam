# to-do:

    - setup instructions
    - api setup guide
        -- .env.example
    - usage guide
    - feature overview

    ## to implement: 

        ### api-client.js / config.js
        - switch to using .env variables
        - make node eviornment
        - npm install dotenv
        - process.env.{var_name}

        ### inherit full course-catalog functionality (display course cards, search, filterby department/credits, addCourse modal, validate form,  exportJSON)
            stripped down basic-json/course-catalog.js

            - needed functions in dashboard.js
                -- loadCourseData()
                    --- call course-catalog's function
                    --- update displays
                -- getAllCourses()
                    --- call course-catalog's function
                    --- update displays
                -- addNewCourse()
                    --- call course-catalog's function
                    --- update displays

            - needed functionality in course-catalog.js
                -- load course data
                -- course cards
                    -- and view details modal
                -- add new course
                    --- and modal
                -- export json data
                -- search courses
                -- error handling and display

        ### dashboard.js
        - setupEventListeners()
        - createDashboardLayout()
        - showWelcomeMessage()
        - showLoadingState()
        - loadCourseData()
        - hideLoadingState()
        - getAllCourses()
        - calculateTotalEnrollment()
        - calculateAverageCapacity()
        - updateTimeDisplays()
        - displayWeatherError()
        - displayHumorError()
        - showErrorState()

        - addNewCourse()
        - exportData()
        - refreshWeather()
        
        - location.reload()


        ### styles.css: 
        .dashboard-header {}
        .header-content {}
        .header-controls {}
        .header-button {}
        .header-button:hover {}
        .header-button:active {}

        .dashboard-grid {}
        .dashboard-widget {} 
        .widget-header {}
        .loading {}

        .stats-overview {}
        .stat-card {}
        .stat-number {}
        .stat-label {}

        .weather-widget {}
        .last-updated {}
        .weather-content {}
        .location {}
        .temperature {}
        .description {}
        .details {}

        .course-widget {}
        .widget-controls {}
        .courses-grid {}

        .humor-widget {}
        .refresh-btn {}
        .refresh-btn:hover {}
        .refresh-btn:active {}
        .humor-content {}
        .joke-section {}
        .joke-text {}

        .actions-widget {}
        .actions-grid {}
        .action-btn {}
        .action-btn:hover {}
        .action-btn:active {}

        .modal {}
        .modal-content {}
        .api-key-setup {}
        .modal-actions {}
        .save-btn {}
        .save-btn:hover {}
        .save-btn:active {}

        .initialization-error {}

        @media (/* for mobile || half screen */) {}



