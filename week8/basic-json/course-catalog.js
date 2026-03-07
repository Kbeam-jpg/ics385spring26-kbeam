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

        add new course button -> #partial, works
            prevent page reload
            addFormSubmitted() 
                -> make object, push object to right department
                -> getallCourses(), displayCourses, displayStatistics()

        export JSON button -> #done
            -> JSON.stringify current catalog object
            -> make, click download anchor tag, remove

*/

/**
 * @constructor - courseCatalog{}, filteredCourses[], currentView, map searchCache, stats{}, currentFilters{}
 * @initializeApp()
 * @setupEventListeners() - buttons/modal
 * @addFormSubmitted() 
 * @validateCourseData()
 * @exportJson() - download this.CourseCatalog as .JSON
 * @loadSampleData() - fetch, parse JSON, setup page
 * @validateCatalogStructure()
 * @getAllCourses()
 * @searchCourses(filters) - applies query, department, credits filters
 * @displayCourses()
 * @createCourseCard()
 * @updateDisplayStats()
 * @displayStatistics()
 * @truncateText()
 * @handleError() - unused
 * @showErrorMessage() - unused
 * @showCourseDetails() - unused
 */
class CourseCatalogManager {

    constructor() {
        this.courseCatalog = null;
        this.filteredCourses = [];
        this.currentView = 'all';
        this.searchCache = new Map();
        this.stats = { numCourses: 0, numDepartments: 0, avgEnroll: 0 };
        this.currentFilters = { query: '', department: '', credits: '' };
        this.initializeApp();
    }

    initializeApp() {
        try {
            this.setupEventListeners();
            this.loadSampleData();
        } catch (error) {
            console.log('Application initialization failed', error);
        }
    }

    setupEventListeners() {

        // export button on click -> 
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportJSON();
        });

        // Add Course button on submit ->
        document.getElementById('addCourseForm').addEventListener('submit', (event) => {
            event.preventDefault();  //prevent default form submission
            this.addFormSubmitted();
            this.hideAddModal();
        });

        // View Details button on click -> to-do: showCourseDetails()
        document.getElementById('coursesContainer').addEventListener('click', (event) => {
            if (event.target.classList.contains('details-btn')) {
                const courseCode = event.target.closest('.course-card').dataset.courseCode;
                // console.log(courseCode, typeof courseCode);
                this.showCourseDetails(courseCode);
            }
        });

         // either modal x close button
        document.getElementById('close-btn').addEventListener('click', () => {
            this.hideAddModal();
        });
        document.getElementById('details-close-btn').addEventListener('click', () => {
            this.hideDetailsModal();
        });

        // Add Course button on click -> show add course modal
        document.getElementById('addCourseBtn').addEventListener('click', () => {
            this.showModal('addModal');
        });
       
        // cancel button -> hide add course modal
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideAddModal();
        });

        // incorporate search and filter event listeners for searchCourses(), filterByDepartment(), filterByCredits()
        document.getElementById('searchInput').addEventListener('input', (event) => {
            // console.log('search input updated: ', event.target.value);
            this.currentFilters.query = event.target.value;
            this.searchCourses(this.currentFilters);
        });
        document.getElementById('departmentFilter').addEventListener('change', (event) => {
            // console.log('department filter updated: ', event.target.value);
            this.currentFilters.department = event.target.value;
            this.searchCourses(this.currentFilters);
        });
        document.getElementById('creditsFilter').addEventListener('change', (event) => {
            // console.log('credits filter updated: ', event.target.value);
            this.currentFilters.credits = event.target.value;
            this.searchCourses(this.currentFilters);
        });

        document.getElementById('clearSearchBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            document.getElementById('departmentFilter').value = '';
            document.getElementById('creditsFilter').value = '';
            this.currentFilters = { query: '', department: '', credits: '' };
            this.searchCourses(this.currentFilters);
        });
    }

    showModal(modalElement) {
        document.getElementById(modalElement).style.display = 'flex';
    }
    //these needed to be separate functions because of different modals?
    hideAddModal() {
        document.getElementById('addModal').style.display = 'none';
    }
    hideDetailsModal() {
        document.getElementById('courseModal').style.display = 'none';
    }

    addFormSubmitted() {
    // AI attribution: Gemini 3.1 Pro for parsing checkboxes, array formatting

        // Extract and format course code 
        const department = document.getElementById('department').value;
        const courseNumber = document.getElementById('courseNumber').value;
        const courseCode = `${department} ${courseNumber}`;

        // Extract and split comma-separated strings into arrays
        const prereqsInput = document.getElementById('prerequisites').value;
        const prerequisites = prereqsInput 
            ? prereqsInput.split(',').map(item => item.trim()).filter(Boolean) 
            : [];

        const topicsInput = document.getElementById('topics').value;
        const topics = topicsInput 
            ? topicsInput.split(',').map(item => item.trim()).filter(Boolean) 
            : [];

        // Gather checked days into an array
        const checkedDays = document.querySelectorAll('input[name="days"]:checked');
        const daysArray = Array.from(checkedDays).map(checkbox => checkbox.value);

        // 5. Format the Time string (e.g., "10:00 AM - 10:50 AM")
        const startHour = document.getElementById('startHour').value;
        const startMin = document.getElementById('startMinute').value;
        const startAmPm = document.getElementById('startAmPm').value.toUpperCase();
        
        const endHour = document.getElementById('endHour').value;
        const endMin = document.getElementById('endMinute').value;
        const endAmPm = document.getElementById('endAmPm').value.toUpperCase();
        
        const timeString = `${startHour}:${startMin} ${startAmPm} - ${endHour}:${endMin} ${endAmPm}`;

        // make final object
        const courseObject = {
            courseCode: courseCode,
            title: document.getElementById('courseTitle').value,
            credits: parseInt(document.getElementById('credits').value, 10), //parse as base-10
            description: document.getElementById('description').value,
            prerequisites: prerequisites,
            instructor: {
                name: document.getElementById('instructorName').value,
                email: document.getElementById('instructorEmail').value,
                office: document.getElementById('instructorOffice').value
            },
            schedule: {
                days: daysArray,
                time: timeString,
                location: document.getElementById('location').value,
                capacity: parseInt(document.getElementById('capacity').value, 10),
                enrolled: parseInt(document.getElementById('enrolled').value, 10)
            },
            isActive: true,
            topics: topics,
            assignments: [{/*assignments go here*/}]
        };

        // Output the final object to the console to verify
        console.log(courseObject);
        var courseObjErrors = this.validateCourseData(courseObject);

        // if good
        if (courseObjErrors.isValid === 0) {
            const dept =  this.courseCatalog.departments.find(dpt => dpt.code === department);
            
            if (dept) {
                dept.courses.push(courseObject);

                // update metadata
                this.courseCatalog.metadata.totalCourses += 1;
                // not touching departments yet
                this.courseCatalog.metadata.totalCreditsOffered += courseObject.credits;

                // refresh cards w/ new card
                this.searchCourses(this.currentFilters); // reapply current filters
                this.displayCourses(); //exists
                this.displayStatistics();
            } else {
                courseObjErrors.errors.push('Department not found');
                courseObjErrors.isValid++;
            }
        }


        
        // comment out when done
        // for each error in the list of errors, add list element to <ul id="errorList">
        const errorList = document.getElementById('errorList');
        errorList.innerHTML = ''; // Clear previous errors
        if (courseObjErrors.isValid > 0) {
            courseObjErrors.errors.forEach(error => {
                const li = document.createElement('li');
                li.textContent = error;
                errorList.appendChild(li);
            });
            // add stringified course object to list for testing
            const courseJson = document.createElement('li');
            courseJson.textContent = JSON.stringify(courseObject, null, 2);
            errorList.appendChild(courseJson);
        } else {
            const li = document.createElement('li');
            li.textContent = 'Course data is valid!';
            errorList.appendChild(li);

            // add stringified course object to list for testing
            const courseJson = document.createElement('li');
            courseJson.textContent = JSON.stringify(courseObject, null, 2);
            errorList.appendChild(courseJson);
        }
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
        if (!course.credits || !Number.isInteger(course.credits) || course.credits < 1 || course.credits > 6) {
            errors.push('Credits must be an integer between 1 and 6');
        }

        // Validate instructor object
        // check if exists, is an object
        if (!course.instructor || typeof course.instructor !== 'object') {
            errors.push('Instructor information is required');
        } else {

            //validate instructor values
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

            // validate schedule values
            // check if days is array, has elements
            if (!Array.isArray(course.schedule.days) || course.schedule.days.length === 0) {
                errors.push('Schedule days must be non-empty');
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
            * capacityGood, enrolledGood bools might not be needed, 
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

    exportJSON() { 
        // from https://www.aspsnippets.com/Articles/2921/Download-JSON-object-Array-as-File-from-Browser-using-JavaScript/

        // i guess making an invisible anchor, clicking it, then removing it is a way to go about it...
        try {
            // turn to jsonString
            let jsonString = JSON.stringify(this.courseCatalog);

            // large binary type:json
            var jsonBlob = new Blob([jsonString], {type: 'application/json'});

            // make url
            var url = window.URL.createObjectURL(jsonBlob);

            // setup anchor element
            var a = document.createElement("a");
            a.download = "course-catalog.json";
            a.href = url;

            // add <a>, click, remove <a>
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

        } catch (error) {
            //handle error
            this.handleError("Export failed", error)
        }
    }

   /**
     * Parse JSON string, update courseCatalog, make this.filteredCourses for no filter
     *  @async
     */
    async loadSampleData() {
        var jsonString = null;
        try {

            // Fetch the JSON file
            // Runs into CORS issues if not server fed
            const response = await fetch('sample-data-copy.json');
            jsonString = await response.text();
        } catch (error) {
            console.log("CORS error, no server to fetch file from.\n Loading backup data")
            jsonString = JSON.stringify(_sample);

        }

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
            
            this.searchCourses(this.currentFilters); // apply initial filters (none)
            this.displayCourses(); //exists
            this.displayStatistics();
            console.log('Course catalog loaded successfully');
            // this.showSuccessMessage('Course catalog loaded with ' + this.filteredCourses.length + ' courses');

        } catch (error) {
            console.error('JSON parsing error:', error);
            // this.handleError('Failed to load course data', error);
        }
    }
    /**
     * Throws errors relevant to missing fields, missing departments, missing department fields for courseCatalog object
     * @param {object} data - from sample-data.json
     */
    validateCatalogStructure(data) { //works

        const required = ['university', 'semester', 'departments', 'metadata'];
        const missing = required.filter(field => !data.hasOwnProperty(field));

        // works
        if (missing.length > 0) {
            throw new Error('Missing required fields: ' + missing.join(', '));
        }

        // works
        if (!Array.isArray(data.departments) || data.departments.length === 0) {
            throw new Error('Departments array is required and must contain at least one department');
        }

        // works, but only shows first error
        // Validate each department structure
        data.departments.forEach((dept, index) => {
        if (!dept.code || !dept.name || !Array.isArray(dept.courses)) {
            throw new Error('Department ' + index + ' missing required fields');
        }
        });
    }
    /**
     * Loops through courseCatalog, grabs each course object 
     * @returns {Array} array of objects -> [ { ...course, department.code, department.name} ]
     * @info ...course = { courseCode, title, credits, description, prerequisites[], instructor{}, schedule{}, isActive, topics[], assignments[] }
     */ 
    getAllCourses() {  // works

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

    displayCourses() {

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
            course.topics.map(topic => '<span class="topic-tag">' + topic + ' ' + '</span>').join('') +
        '</div>' +
        '<button class="details-btn">' + 
            'View Details' + 
        '</button>';

        cardDiv.innerHTML = cardHTML;
        return cardDiv;
    }
    /**
     * Update this.stats w/ 
     * tally number of courses, departments, and calculate average enrollment
     * based on state of this.filteredCourses[] when called
     * @does update this.stats{numCourses, numDepartments, avgEnroll}
     */
    updateDisplayStats(){

        // tally number of courses
        this.stats.numCourses = this.filteredCourses.length;

        // tally number of unique departments
        // use set to avoid duplicates
        let unqiueDepts = new Set(this.filteredCourses.map(course => course.departmentCode));
        this.stats.numDepartments = unqiueDepts.size;

        // calculate average enrollment percentage
        if (this.filteredCourses.length > 0){ //works
            // run reduce on each course
            let totalPercent = this.filteredCourses.reduce((sum, course) => {
                // sum each enrolment percentage
                return sum + (course.schedule.enrolled / course.schedule.capacity * 100);
            }, 0);

            // get avg total / items ***(rounded to whole digit)
            this.stats.avgEnroll = Math.round(totalPercent / this.filteredCourses.length);

        } else {
            this.stats.avgEnroll = 0;
        }
    }
    /**
     * // id="totalCourses", id="totalDepartments", id="averageEnrollment"
     */
    displayStatistics(){
        document.getElementById("totalCourses").innerHTML = this.stats.numCourses;
        document.getElementById("totalDepartments").innerHTML = this.stats.numDepartments;
        document.getElementById("averageEnrollment").innerHTML = this.stats.avgEnroll + '%';
    }


    //####### UNUSED
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
    showErrorMessage(message) {
        // add error message to error section
    }
    // ######


    showCourseDetails(courseCode) {
        // to-do: for createCourseContent()
        /*
        courseCode: string;
            title: string;
            credits: number;
            description: string;
            prerequisites: string[];
            instructor: {
                name: string;
                email: string;
                office: string;
            };
            schedule: {
                days: string[];
                time: string;
                location: string;
                capacity: number;
                enrolled: number;
            };
            isActive: boolean;
            topics: string[];
            assignments: {
                name: string;
                points: number;
                dueDate: string;
            }[];
        };
        */

        // find course by course.code, populate modal with course details, show modal
        try { 
        const course = this.getAllCourses().find(c => c.courseCode === courseCode);

            //don't think it'll get to this check, but doesn't hurt
            if (!course) {
                console.error('Course not found: ' + courseCode);
                return;
            }
        
            // populate modal with course details
            // to-do: createCourseContent(course)
            const modalContent = document.getElementById('modalBody');
            modalContent.innerHTML = `
                <h2>${course.courseCode}: ${course.title}</h2>
                <p><strong>Credits:</strong> ${course.credits}</p>
                <p><strong>Description:</strong> ${course.description}</p>
                <p><strong>Prerequisites:</strong> ${(course.prerequisites || []).join(', ')}</p>
                <p><strong>Instructor:</strong> ${course.instructor.name} (${course.instructor.email})</p>
                <p><strong>Schedule:</strong> ${course.schedule.days.join(', ')} ${course.schedule.time} at ${course.schedule.location}</p>
                <p><strong>Enrollment:</strong> ${course.schedule.enrolled}/${course.schedule.capacity}</p>
                <p><strong>Topics:</strong> ${(course.topics || []).join(', ')}</p>
                <h3>Assignments:</h3>
                <ul>
                    ${(course.assignments || []).map(assignment => `<li>${assignment.name} - ${assignment.points} points, due ${assignment.dueDate}</li>`).join('')}
                </ul>`;
            // show modal
            this.showModal('courseModal');

        } catch (error) {
            console.error('Error showing course details:', error);
            console.log(courseCode, error);
            // this.handleError('Show Course Details', error);
        }
    }

    searchCourses(filters) {
        let courses = this.getAllCourses();

        // Apply department filter
        // departmentFilter()
        if (filters.department && filters.department !== '' && filters.department !== 'all') {
            courses = courses.filter(course => course.departmentCode === filters.department);
        }

        // Apply credits filter
        // creditsFilter()
        if (filters.credits && filters.credits !== '' && filters.credits !== 'all') {
            const creditsValue = parseInt(filters.credits, 10);
            if (filters.credits === '4+') {
                courses = courses.filter(course => course.credits >= 4);
            } else {
                courses = courses.filter(course => course.credits === creditsValue);
            }
        }

        // Apply text search
        if (filters.query && filters.query.trim().length > 0) {
            const searchTerm = filters.query.toLowerCase().trim();
            courses = courses.filter(course => {
                return course.courseCode.toLowerCase().includes(searchTerm) ||
                       course.title.toLowerCase().includes(searchTerm) ||
                       course.description.toLowerCase().includes(searchTerm) ||
                       course.instructor.name.toLowerCase().includes(searchTerm) ||
                       course.topics.some(topic => topic.toLowerCase().includes(searchTerm)) ||
                       course.departmentName.toLowerCase().includes(searchTerm);
            });
        }

        this.filteredCourses = courses;
        this.displayCourses();
    }

    //########


    // helper function to make createCourseCard work
    truncateText(text, length) {
        if (text.length <= length) {
            return text;
        } else {
            return text.slice(0, length) + '(see more)';
        }
    }

}

// exportJSON button works:
//backup sample data for testing exportJSON function without fetch
const _sample = {"university":"University of Hawaii Maui College","semester":"Spring 2026","lastUpdated":"2026-03-05","departments":[{"code":"ICS","name":"Information and Computer Sciences","chair":"Dr. Jane Smith","courses":[{"courseCode":"ICS 385","title":"Web Development and Administration","credits":3,"description":"Detailed knowledge of web page authoring and server-side programming.","prerequisites":["ICS 320"],"instructor":{"name":"Dr. Debasis Bhattacharya","email":"debasisb@hawaii.edu","office":"Kaaike 114"},"schedule":{"days":["Tuesday"],"time":"4:30 PM - 5:45 PM","location":"Online (Zoom)","capacity":25,"enrolled":18},"isActive":true,"topics":["HTML","CSS","JavaScript","Node.js","APIs","React"],"assignments":[{"name":"Week 1 - Setup","points":1,"dueDate":"2026-01-19"},{"name":"Week 2 - HTML/CSS","points":3,"dueDate":"2026-01-26"}]},{"courseCode":"ICS 360","title":"Database Design and Development",
    "credits":3,"description":"Detailed knowledge of database design and development","prerequisites":["ICS 320"],"instructor":{"name":"Jake Domingo","email":"domingoj@hawaii.edu","office":""},"schedule":{"days":[""],"time":"","location":"Online (Async)","capacity":25,"enrolled":14},"isActive":true,"topics":["SQL","Data","Management","Server","Models"],"assignments":[{"name":"Midterm Exam","points":100,"dueDate":"2026-03-15"},{"name":"Final Exam","points":100,"dueDate":"2026-05-15"}]}]},{"code":"MATH","name":"Mathematics","chair":"Dr. Robert Johnson","courses":[{"courseCode":"MATH 241","title":"Calculus I","credits":3,"description":"Limits, derivatives, applications of derivatives.","prerequisites":["MATH 135"],"instructor":{"name":"Dr. Sarah Wilson","email":"sarahw@hawaii.edu","office":"Academic Center 201"},"schedule":{"days":["Monday","Wednesday","Friday"],"time":"10:00 AM - 10:50 AM","location":"AC 105",
        "capacity":30,"enrolled":30},"isActive":true,"topics":["Limits","Derivatives","Integration","Applications"],"assignments":[{"name":"Homework 1","points":10,"dueDate":"2026-01-20"},{"name":"Midterm Exam","points":100,"dueDate":"2026-03-15"}]},{"courseCode":"MATH 242","title":"Calculus II","credits":3,"description":"Differentiation and integration of the transcendental functions","prerequisites":["MATH 205 or MATH 241"],"instructor":{"name":"John Okamoto","email":"okamotoj@hawaii.edu","office":""},"schedule":{"days":["Tuesday","Thursday"],"time":"1:30 PM - 3:10 PM","location":"KUPAA 204 ","capacity":24,"enrolled":10},"isActive":true,"topics":["Limits","Derivatives","Integration","Applications"],"assignments":[{"name":"Midterm Exam 1","points":100,"dueDate":"2026-02-20"},{"name":"Midterm Exam 2","points":100,"dueDate":"2026-03-29"},{"name":"Final Exam","points":150,"dueDate":"2026-05-15"}]},
        {"courseCode":"MATH 243","title":"Calculus III","credits":3,"description":"Introduces the study of functions of several variables with multiple integrals","prerequisites":["MATH 242"],"instructor":{"name":"John Okamoto","email":"okamotoj@hawaii.edu","office":""},"schedule":{"days":[""],"time":"","location":"Online (Async)","capacity":24,"enrolled":0},"isActive":false,"topics":["Limits","Derivatives","Integration","Applications","Multi-variable"],"assignments":[{"name":"Midterm Exam 1","points":100,"dueDate":"2026-02-20"},{"name":"Midterm Exam 2","points":100,"dueDate":"2026-03-29"},{"name":"Final Exam","points":150,"dueDate":"2026-05-15"}]},{"courseCode":"MATH 244","title":"Calculus IV","credits":3,"description":"Extends the study of functions of several variables with multiple integrals and vector analysis","prerequisites":["MATH 243"],"instructor":{"name":"John Okamoto",
            "email":"okamotoj@hawaii.edu","office":""},"schedule":{"days":["Tuesday","Thursday"],"time":"1:30 PM - 3:10 PM","location":"Online (Zoom)","capacity":24,"enrolled":10},"isActive":true,"topics":["Limits","Derivatives","Integration","Applications","Multi-variable","vectors","elementary"],"assignments":[{"name":"Midterm Exam 1","points":100,"dueDate":"2026-02-20"},{"name":"Midterm Exam 2","points":100,"dueDate":"2026-03-29"},{"name":"Final Exam","points":150,"dueDate":"2026-05-15"}]}]},{"code":"ANTH","name":"Anthropology","chair":"Dr. John Doe","courses":[{"courseCode":"ANTH 152","title":"Culture & Humanity","credits":3,"description":"Provides and introduction to cultural anthropology","prerequisites":["ENG 22 or ENG 100"],"instructor":{"name":"Dr. Melissa Kirkendall","email":"kirkendaj@hawaii.edu","office":""},"schedule":{"days":["Tuesday","Thursday"],"time":"1:30 PM - 2:45 PM",
                "location":"Online (Zoom)","capacity":25,"enrolled":21},"isActive":true,"topics":["Anthropology","Culture","Perspective","enviornment","humans","interactions"],"assignments":[{"name":"Weekly Posts","points":7,"dueDate":""},{"name":"Final Paper","points":100,"dueDate":"2026-05-11"}]},{"courseCode":"ANTH 200","title":"Cultural Anthropology","credits":3,"description":"Studies the concept of culture and basic tools for analyzing cultural behavior","prerequisites":["ENG 22 or ENG 100"],"instructor":{"name":"Dr. Jane Kirkendall","email":"kirkendaj@hawaii.edu","office":""},"schedule":{"days":[""],"time":"","location":"Online (Async)","capacity":25,"enrolled":23},"isActive":true,"topics":["Anthropology","Culture","patterning","integration","change","dynamics"],"assignments":[{"name":"Weekly Posts","points":7,"dueDate":""},{"name":"Final Paper","points":100,"dueDate":"2026-05-15"}]}]}],
                "metadata":{"totalCourses":8,"totalDepartments":3,"totalCreditsOffered":24,"academicYear":"2025-2026"}};

// script
var courseApp = new CourseCatalogManager();
// document.getElementById("courseModal").style.display = "none";
console.log("courseApp: ", courseApp.stats,"\nTime:", new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
