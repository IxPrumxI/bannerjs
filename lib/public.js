'use strict';


const config = require('./config');
const{ 
    bannerRequest, 
    batchRequest 
} = require('./private');

/**
 * @exports
 */
module.exports = {
    async getTerms(offset=1, max=-1){
        let res = await bannerRequest(this.School, 'getTerms', {offset: offset, max: max});
        return res;
    },

    async getSubjects(term, offset=1, max=-1){
        if (!term){
            throw new Error('Must provide term');
        }

        let res = await bannerRequest(this.School, 'get_subject', {offset: offset, max: max, term: term});
        return res;
    },
    
    async getInstructors(term){
        if (!term){
            throw new Error('Must provide term');
        }
        let instructors = [];
        let results = -1;
        let batch = 0;
        do {
            results = await batchRequest(config.global.batchSizes.instructors, config.global.pageSizes.instructors,
                batch, {term: term}, 'get_instructor', this.School);
            instructors.push(...results);
            batch++;
        } while (instructors.length > 0 && results.length === config.global.batchSizes.instructors);
        
        return instructors;
    },
    
    async getCampuses(){         
        let res = await bannerRequest(this.School, 'get_campus');
        return res;
    },
    
    async getColleges(){
        let res = await bannerRequest(this.School, 'get_college');
        return res;
    },
    
    async getAttributes(){           
        let res = await bannerRequest(this.School, 'get_attribute');
        return res;
    },

    async getSessions(){
        let res = await bannerRequest(this.School, 'get_session');
        return res;
    },

    async getPartsOfTerm(){
        let res = await bannerRequest(this.School, 'get_partOfTerm');
        return res;
    },

    async getInstructionalMethods(){
        let res = await bannerRequest(this.School, 'get_instructionalMethod');
        return res;
    },

    async getCourseDescription(term, crn){
        if (arguments.length < 2){
            throw new Error('Must provide term and CRN');
        }
        let res = await bannerRequest(this.School, 'getCourseDescription', {term: term, courseReferenceNumber: crn});
        return res.slice(4, -5); //Remove <p> tag from returned HTML
    },
    
    async classSearch(term, subject, course, campus){
        const params = {
            ...(subject ? {txt_subject: subject} : {}),
            ...(term ? {txt_term: term, term} : {}),
            ...(course ? {txt_courseNumber: course} : {}),
            ...(campus ? {txt_campus: campus} : {})
        };

        let res = await bannerRequest(this.School, 'searchResults', params, true);
        return res;
    },
    
    async catalogSearch(term, subject, offset=0, pageSize=-1){
        if (arguments.length < 2){
            throw new Error('Must provide term and subject');
        }
        const params = {
            txt_subject: subject, 
            txt_term: term,
            term: term, 
            pageOffset: offset, 
            pageMaxSize: pageSize
        };
        let res = await bannerRequest(this.School, 'courseSearchResults', params, true);
        return res;
    }
}