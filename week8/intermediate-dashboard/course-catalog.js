/* INFO
NAME: Kendall Beam
ASSIGNMENT: Assignment 8b - Integrated Campus Dashboard
GOAL: a stripped version of basic-json/course-catalog for the dashboard's 
FILENAME: course-catalog.js 
    (see dashboard.js)
DATE: 3/9/2026
*/

class CourseCatalog {

    constructor() {
        this.courseCatalog = null;
        this.filteredCourses = [];
        this.currentView = 'all'; //didn't know what this was for
        this.searchCache = new Map(); // unused
        this.stats = { numCourses: 0, numDepartments: 0, avgEnroll: 0 };
        this.currentFilters = { query: '', department: '', credits: '' };
        this.initialize();
    }

    initialize() {
        try {
            this.loadSampleData();
        } catch (error) {
            console.log('Object initialization failed', error);
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

    /** 
     * - Grab each addForm variable, make into object, push to courseCatalog
     * - Will only add object if no errors from validateCourseData() are returned
     * - to-do: add 
     */
    addFormSubmitted() {
    // AI attribution: Gemini 3.1 Pro for parsing checkboxes, array formatting

        // extract and format course code 
        const department = document.getElementById('department').value;
        const courseNumber = document.getElementById('courseNumber').value;
        const courseCode = `${department} ${courseNumber}`;

        // extract and split comma-separated strings into arrays
        const prereqsInput = document.getElementById('prerequisites').value;
        const prerequisites = prereqsInput 
            ? prereqsInput.split(',').map(item => item.trim()).filter(Boolean) //if exists
            : []; //if null

        const topicsInput = document.getElementById('topics').value;
        const topics = topicsInput 
            ? topicsInput.split(',').map(item => item.trim()).filter(Boolean) //if exists
            : []; //if null

        // gather all checked days into an array
        const checkedDays = document.querySelectorAll('input[name="days"]:checked');
        const daysArray = Array.from(checkedDays).map(checkbox => checkbox.value);

        // format the time string (e.g., "10:00 AM - 10:50 AM")
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

        // check for errors (return list of error messages)
        var courseObjErrors = this.validateCourseData(courseObject);

        // if good 
        if (courseObjErrors.isValid === 0) {

            // find the department to append object to
            const dept =  this.courseCatalog.departments.find(dpt => dpt.code === department);
            
            // if found
            if (dept) {

                // append object to end of list
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
        // // for each error in the list of errors, add list element to <ul id="errorList">
        // const errorList = document.getElementById('errorList');
        // errorList.innerHTML = ''; // Clear previous errors
        // if (courseObjErrors.isValid > 0) {
        //     courseObjErrors.errors.forEach(error => {
        //         const li = document.createElement('li');
        //         li.textContent = error;
        //         errorList.appendChild(li);
        //     });
        //     // add stringified course object to list for testing
        //     const courseJson = document.createElement('li');
        //     courseJson.textContent = JSON.stringify(courseObject, null, 2);
        //     errorList.appendChild(courseJson);
        // } else {
        //     const li = document.createElement('li');
        //     li.textContent = 'Course data is valid!';
        //     errorList.appendChild(li);

        //     // add stringified course object to list for testing
        //     const courseJson = document.createElement('li');
        //     courseJson.textContent = JSON.stringify(courseObject, null, 2);
        //     errorList.appendChild(courseJson);
        // }
    }
    /**
     * Validates JSON course data string for requirements, credits, instructor object, schedule object, and topics array.
     * @param course is a JS object with at least three keys 'courseCode', 'title', 'description'
     * @returns {isValid: num, errors: string[]}a JS object -> \{isValid: # of errors, error: list of errors}
     * - to-do: error handle -> course code already exists, move over regex from html file, etc.
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
            * capacityGood + enrolledGood bools might not be needed, 
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

    // any other functions i might need
}

//backup sample data for CORS
const _sample = {"university":"University of Hawaii Maui College","semester":"Spring 2026","lastUpdated":"2026-03-05","departments":[{"code":"ICS","name":"Information and Computer Sciences","chair":"Dr. Jane Smith","courses":[{"courseCode":"ICS 385","title":"Web Development and Administration","credits":3,"description":"Detailed knowledge of web page authoring and server-side programming.","prerequisites":["ICS 320"],"instructor":{"name":"Dr. Debasis Bhattacharya","email":"debasisb@hawaii.edu","office":"Kaaike 114"},"schedule":{"days":["Tuesday"],"time":"4:30 PM - 5:45 PM","location":"Online (Zoom)","capacity":25,"enrolled":18},"isActive":true,"topics":["HTML","CSS","JavaScript","Node.js","APIs","React"],"assignments":[{"name":"Week 1 - Setup","points":1,"dueDate":"2026-01-19"},{"name":"Week 2 - HTML/CSS","points":3,"dueDate":"2026-01-26"}]},{"courseCode":"ICS 360","title":"Database Design and Development",
    "credits":3,"description":"Detailed knowledge of database design and development","prerequisites":["ICS 320"],"instructor":{"name":"Jake Domingo","email":"domingoj@hawaii.edu","office":""},"schedule":{"days":[""],"time":"","location":"Online (Async)","capacity":25,"enrolled":14},"isActive":true,"topics":["SQL","Data","Management","Server","Models"],"assignments":[{"name":"Midterm Exam","points":100,"dueDate":"2026-03-15"},{"name":"Final Exam","points":100,"dueDate":"2026-05-15"}]}]},{"code":"MATH","name":"Mathematics","chair":"Dr. Robert Johnson","courses":[{"courseCode":"MATH 241","title":"Calculus I","credits":3,"description":"Limits, derivatives, applications of derivatives.","prerequisites":["MATH 135"],"instructor":{"name":"Dr. Sarah Wilson","email":"sarahw@hawaii.edu","office":"Academic Center 201"},"schedule":{"days":["Monday","Wednesday","Friday"],"time":"10:00 AM - 10:50 AM","location":"AC 105",
        "capacity":30,"enrolled":30},"isActive":true,"topics":["Limits","Derivatives","Integration","Applications"],"assignments":[{"name":"Homework 1","points":10,"dueDate":"2026-01-20"},{"name":"Midterm Exam","points":100,"dueDate":"2026-03-15"}]},{"courseCode":"MATH 242","title":"Calculus II","credits":3,"description":"Differentiation and integration of the transcendental functions","prerequisites":["MATH 205 or MATH 241"],"instructor":{"name":"John Okamoto","email":"okamotoj@hawaii.edu","office":""},"schedule":{"days":["Tuesday","Thursday"],"time":"1:30 PM - 3:10 PM","location":"KUPAA 204 ","capacity":24,"enrolled":10},"isActive":true,"topics":["Limits","Derivatives","Integration","Applications"],"assignments":[{"name":"Midterm Exam 1","points":100,"dueDate":"2026-02-20"},{"name":"Midterm Exam 2","points":100,"dueDate":"2026-03-29"},{"name":"Final Exam","points":150,"dueDate":"2026-05-15"}]},
        {"courseCode":"MATH 243","title":"Calculus III","credits":3,"description":"Introduces the study of functions of several variables with multiple integrals","prerequisites":["MATH 242"],"instructor":{"name":"John Okamoto","email":"okamotoj@hawaii.edu","office":""},"schedule":{"days":[""],"time":"","location":"Online (Async)","capacity":24,"enrolled":0},"isActive":false,"topics":["Limits","Derivatives","Integration","Applications","Multi-variable"],"assignments":[{"name":"Midterm Exam 1","points":100,"dueDate":"2026-02-20"},{"name":"Midterm Exam 2","points":100,"dueDate":"2026-03-29"},{"name":"Final Exam","points":150,"dueDate":"2026-05-15"}]},{"courseCode":"MATH 244","title":"Calculus IV","credits":3,"description":"Extends the study of functions of several variables with multiple integrals and vector analysis","prerequisites":["MATH 243"],"instructor":{"name":"John Okamoto",
            "email":"okamotoj@hawaii.edu","office":""},"schedule":{"days":["Tuesday","Thursday"],"time":"1:30 PM - 3:10 PM","location":"Online (Zoom)","capacity":24,"enrolled":10},"isActive":true,"topics":["Limits","Derivatives","Integration","Applications","Multi-variable","vectors","elementary"],"assignments":[{"name":"Midterm Exam 1","points":100,"dueDate":"2026-02-20"},{"name":"Midterm Exam 2","points":100,"dueDate":"2026-03-29"},{"name":"Final Exam","points":150,"dueDate":"2026-05-15"}]}]},{"code":"ANTH","name":"Anthropology","chair":"Dr. John Doe","courses":[{"courseCode":"ANTH 152","title":"Culture & Humanity","credits":3,"description":"Provides and introduction to cultural anthropology","prerequisites":["ENG 22 or ENG 100"],"instructor":{"name":"Dr. Melissa Kirkendall","email":"kirkendaj@hawaii.edu","office":""},"schedule":{"days":["Tuesday","Thursday"],"time":"1:30 PM - 2:45 PM",
                "location":"Online (Zoom)","capacity":25,"enrolled":21},"isActive":true,"topics":["Anthropology","Culture","Perspective","enviornment","humans","interactions"],"assignments":[{"name":"Weekly Posts","points":7,"dueDate":""},{"name":"Final Paper","points":100,"dueDate":"2026-05-11"}]},{"courseCode":"ANTH 200","title":"Cultural Anthropology","credits":3,"description":"Studies the concept of culture and basic tools for analyzing cultural behavior","prerequisites":["ENG 22 or ENG 100"],"instructor":{"name":"Dr. Jane Kirkendall","email":"kirkendaj@hawaii.edu","office":""},"schedule":{"days":[""],"time":"","location":"Online (Async)","capacity":25,"enrolled":23},"isActive":true,"topics":["Anthropology","Culture","patterning","integration","change","dynamics"],"assignments":[{"name":"Weekly Posts","points":7,"dueDate":""},{"name":"Final Paper","points":100,"dueDate":"2026-05-15"}]}]}],
                "metadata":{"totalCourses":8,"totalDepartments":3,"totalCreditsOffered":24,"academicYear":"2025-2026"}};