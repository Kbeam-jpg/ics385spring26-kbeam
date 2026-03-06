

// Course Catalog Manager - Core Implementation
class CourseCatalogManager {

    /*call chain 
        -> initializeApp()
            -> setupEventListeners()
                -> submit button
                -> add new course button
                -> exportJSON button

            -> loadSampleData()
                -> JSON.parse(sampleData)
                -> validateCatalogStructure(all Data)

                -> displayCourses()
                    for each course:
                        -> createCourseCard(course)
                    -> updateDisplayStats()

                -> displayStatistics()
        

        submit button ->

        add new course button ->

        export JSON button -> 



    */
    constructor() {
        this.courseCatalog = null;
        this.filteredCourses = [];
        this.currentView = 'all';
        this.searchCache = new Map();
        this.stats = { numCourses: 0, numDepartments: 0, avgEnroll: 0 };
        this.initializeApp();
    }

    initializeApp() {
        try {
            this.setupEventListeners();
            this.loadSampleData(JSON.stringify(sampleData));
        } catch (error) {
            this.handleError('Application initialization failed', error);
        }
    }

    // to-do: button handlers
    async setupEventListeners() {
        
        // submit button id="loadSampleBtn"

        // add new course button "addCourseBtn"
            // in 

            // this.filteredCourses.forEach(course => {
            // const courseCard = this.createCourseCard(course);
            //     container.appendChild(courseCard);
            // });

        // exportJSON button id="exportBtn"
            // change path of anchor.download 
            // -> to JSON.stringify(this.courseCatalog)

    }


    /**
     * @async
     * @param jsonString a json string (sample-data.json)
     */
    async loadSampleData(jsonString) {
        try {

            // Validate JSON format first
            if (!jsonString || typeof jsonString !== 'string') {
                throw new Error('Invalid input: JSON string required');
            }

            // Parse JSON with error handling
            const data = JSON.parse(jsonString);

            // Validate required structure
            this.validateCatalogStructure(data);


            // Store data and update display
            this.courseCatalog = data;
            this.filteredCourses = this.getAllCourses(); //exists
            this.displayAllCourses(); //exists
            this.displayStatistics();
            console.log('Course catalog loaded successfully');
            this.showSuccessMessage('Course catalog loaded with ' + this.filteredCourses.length + ' courses');

        } catch (error) {
            console.error('JSON parsing error:', error);
            this.handleError('Failed to load course data', error);
        }
    }

    displayAllCourses() {
        const container = document.getElementById('coursesContainer');

        if (!container) {
            console.error('Courses container not found');
            return;
        }

        container.innerHTML = '';
        if (this.filteredCourses.length === 0) {
            container.innerHTML = '<div class="no-results">No courses found matching your criteria.</div>';
            return;
        }

        this.filteredCourses.forEach(course => {
            const courseCard = this.createCourseCard(course);
            container.appendChild(courseCard);
        });

        this.updateDisplayStats();
    }

    // to-do:
    // update this.stats based on filteredCourses
    //  # courses, # departments, avg enrollment %
    updateDisplayStats() {

        // loop through filteredCourses

        // tally # of courses

        // tally # of unique departments

        // calc sum of enrollment %'s / # of courses

    }

    // to-check:
    // DOM manip add this.stats values to section id="statisticsSection"
    // id="totalCourses", id="totalDepartments", id="averageEnrollment"
    displayStatistics() {
        const statisticsSection = document.getElementById('statisticsSection');

        statisticsSection.totalCourses.innerHTML = this.stats.numCourses;
        statisticsSection.totalDepartments.innerHTML = this.stats.numDepartments;
        statisticsSection.averageEnrollment.innerHTML = this.stats.avgEnroll + '%';
    }

    searchCourses(query) {

        if (!query || query.trim().length === 0) {
            this.filteredCourses = this.getAllCourses();
            this.displayAllCourses();
            return;
        }

        const searchTerm = query.toLowerCase().trim();

        // Check cache for performance
        if (this.searchCache.has(searchTerm)) {
            this.filteredCourses = this.searchCache.get(searchTerm);
            this.displayAllCourses();
            return;
        }

        // Perform comprehensive search
        // {6 items}
        const results = this.getAllCourses().filter(course => {
            return course.courseCode.toLowerCase().includes(searchTerm) ||
            course.title.toLowerCase().includes(searchTerm) ||
            course.description.toLowerCase().includes(searchTerm) ||
            course.instructor.name.toLowerCase().includes(searchTerm) ||
            course.topics.some(topic => topic.toLowerCase().includes(searchTerm)) ||
            course.departmentName.toLowerCase().includes(searchTerm);
        });

        // Cache results
        this.searchCache.set(searchTerm, results);
        this.filteredCourses = results;
        this.displayAllCourses();
        this.updateSearchStats(searchTerm, results.length);
    }

    filterByDepartment() {
        // to-do: Department-specific course filtering
    }

    filterByCredits() {
        // to-do: Filter courses by credit hours (1-4+ credits)
    }

    showCourseDetails() {
        // to:do: Modal or expanded view with complete course information
    }

    calculateEnrollmentStats() {
        // to-do: Display enrollment percentages and capacity
    }

    addNewCourse() {
        // to-do: Form to add courses with full validation
    }

    /**
     * Validates JSON course data string for requirements, credits, instructor object, schedule object, and topics array.
     * @param course is a JS object with at least three keys 'courseCode', 'title', 'description'
     * @returns a JS object -> \{isValid: # of errors, error: list of errors}
     */
    validateCourseData(course) {

        const errors = []; //to append error strings, to return

        // Required string fields
        const requiredStrings = ['courseCode', 'title', 'description'];
        requiredStrings.forEach(field => {

            // check if exists, is a string, has characters
            if (!course[field] || typeof course[field] !== 'string' || course[field].trim().length === 0) {
                errors.push('Missing or invalid ' + field);
            }
        });

        // Validate credits (must be positive integer 1-6)
        // check if exists, is num, 1 < x < 6
        if (!course.credits || !Number.isInteger(course.credits) || course.credits <= 1 || course.credits > 6) {
            errors.push('Credits must be an integer between 1 and 6');
        }

        // Validate instructor object
        // check if exists, is an object
        if (!course.instructor || typeof course.instructor !== 'object') {
            errors.push('Instructor information is required');

        } else {

            //validate fields
            // check if name + email exists 
            if (!course.instructor.name || !course.instructor.email) {
                errors.push('Instructor name and email are required');
            }

            // Email format validation
            // regex check: line_start + one-or-more[char: not whitespace or @]
            //              + 1 @ sign + one-or-more[char: not whitespace or @]
            //              + 1 . dot  + one-or-more[char: not whitespace or @] + line_end
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // check if exists, passes regex check
            if (course.instructor.email && !emailRegex.test(course.instructor.email)) {
                errors.push('Invalid instructor email format');
            }
        }

        // Validate schedule object
        // check if exists, is an object
        if (!course.schedule || typeof course.schedule !== 'object') {
            errors.push('Schedule information is required');

        } else {

            let capacityGood, enrolledGood = false;
            // validate fields
            // check if days is array, has elements
            if (!Array.isArray(course.schedule.days) || course.schedule.days.length === 0) {
                errors.push('Schedule days must be a non-empty array');
            }

            // check if capacity is num, 1 or greater
            if (typeof course.schedule.capacity !== 'number' || course.schedule.capacity <= 1) {
                errors.push('Schedule capacity must be a positive number');
            } else {
                // if good
                capacityGood = true;
            }

            // check if enrolled is num, 0 or greater
            if (typeof course.schedule.enrolled !== 'number' || course.schedule.enrolled <= 0) {
                errors.push('Schedule enrolled must be a non-negative number');
            } else {
                // if good
                enrolledGood = true;
            }

            // check if capacity is less than enrolled
            if (capacityGood && enrolledGood && course.schedule.enrolled > course.schedule.capacity) {
            errors.push('Enrolled students cannot exceed capacity');
            }   
            
            /* ### 
            * capacityGood, enrolledGood checks might not be needed, 
            * but original could have compared two NaNs or smthn 
            ### */
        }

        // Validate topics array
        // check if array
        if (!Array.isArray(course.topics)) {
            errors.push('Topics must be an array');
        
        // array has topics
        } else if (course.topics.length === 0) {
            errors.push('At least one topic is required');
        }

        // return # of errors, list of errors
        return {isValid: errors.length, errors: errors};
    }


    /**
     * Error handling for JSON operations, print error to console, show error message
     * @param operation some sort of operation
     * @param error some sort of error object
     */
    handleError(operation, error) {
        let userMessage = 'An error occurred';

        if (error instanceof SyntaxError) {
            userMessage = 'Invalid JSON format: Please check your data structure';
        } else if (error.message.includes('Missing required fields')) {
            userMessage = 'Data validation failed: ' + error.message;
        } else if (error.message.includes('network')) {
            userMessage = 'Network error: Please check your connection';
        } else {
            userMessage = operation + ' failed: ' + error.message;
        }

        // Log technical details for debugging
        console.error('JSON Operation Error:', {
            operation: operation,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        
        // Display user-friendly message
        showErrorMessage(userMessage);
    }


    validateCatalogStructure(data) {

        const required = ['university', 'semester', 'departments', 'metadata'];
        const missing = required.filter(field => !data.hasOwnProperty(field));

        if (missing.length > 0) {
            throw new Error('Missing required fields: ' + missing.join(', '));
        }

        if (!Array.isArray(data.departments) || data.departments.length === 0) {
            throw new Error('Departments array is required and must contain at least one department');
        }

        // Validate each department structure
        data.departments.forEach((dept, index) => {
        if (!dept.code || !dept.name || !Array.isArray(dept.courses)) {
            throw new Error('Department ' + index + ' missing required fields');
        }
        });
    }

    /*
    [ [course, department.code, department.name], [course, department.code, department.name], [course, department.code, department.name] ]
    [course, department.code, department.name]
    course = [courseCode, title, credits, description, prerequisites[], instructor{}, schedule{}, isActive, topics[], assignments[]]
    */
    getAllCourses() {

        if (!this.courseCatalog) return [];

        const allCourses = [];
        this.courseCatalog.departments.forEach(dept => {
            dept.courses.forEach(course => {
                allCourses.push({
                    ...course,
                    departmentCode: dept.code,
                    departmentName: dept.name
                });
            });
        });
        return allCourses;
    }

    createCourseCard(course) {

        const cardDiv = document.createElement('div');
        cardDiv.className = 'course-card';
        cardDiv.dataset.courseCode = course.courseCode;

        // Calculate enrollment percentage
        const enrollmentPercent = Math.round((course.schedule.enrolled / course.schedule.capacity) * 100);
        const enrollmentStatus = enrollmentPercent >= 90 ? 'full' : enrollmentPercent >= 70 ? 'filling' : 'open';

        const cardHTML =
        '<div class="course-header">' +
            '<h3 class="course-code">' + course.courseCode + '</h3>' +
            '<span class="credits">' + course.credits + ' credits</span>' +
        '</div>' +
        '<h4 class="course-title">' + course.title + '</h4>' +
        '<p class="course-description">' + this.truncateText(course.description, 120) + '</p>' +
        '<div class="instructor-info">' +
            '<strong>Instructor:</strong> ' + course.instructor.name +
        '</div>' +
        '<div class="schedule-info">' +
            '<strong>Schedule:</strong> ' + course.schedule.days.join(', ') + ' ' + course.schedule.time +
        '</div>' +
        '<div class="enrollment-info ' + enrollmentStatus + '">' +
            'Enrolled: ' + course.schedule.enrolled + '/' + course.schedule.capacity + ' (' + enrollmentPercent + '%)' +
        '</div>' +
        '<div class="topics">' +
            course.topics.map(topic => '<span class="topic-tag">' + topic + '</span>').join('') +
        '</div>' +
        '<button class="details-btn" onclick="app.showCourseDetails(' + course.courseCode + ')">' + 
            'View Details' + 
        '</button>';

        cardDiv.innerHTML = cardHTML;
        return cardDiv;
    }

    
    
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
window.app = new CourseCatalogManager();
});


/**
 * needs functions: 
 * setUpEventListeners() <- initialize app
 * loadSampleData() <- initaialize app
 * displayStatistics() <- initialize app
 * handleError() <- initialize app
 * 
 * showSuccessMessage() <- loadSampleData
 */