import { IncomingMessage } from 'http';

// Configuration object for the module
interface Config {
    global: {
        batchSizes: {
            instructors: number;
        };
        pageSizes: {
            instructors: number;
        };
        basePath: string;
    };
    schools: Record<string, {
        host: string;
    }>;
}

// Main BannerJS class with its methods
declare class BannerJS {
    constructor(school: string);

    getTerms(offset?: number, max?: number): Promise<Response>;

    getSubjects(term: string, offset?: number, max?: number): Promise<Response>;

    getInstructors(term: string): Promise<Response>;

    getCampuses(): Promise<Response>;

    getColleges(): Promise<Response>;

    getAttributes(): Promise<Response>;

    getSessions(): Promise<Response>;

    getPartsOfTerm(): Promise<Response>;

    getInstructionalMethods(): Promise<Response>;

    getCourseDescription(term: string, crn: string): Promise<string>;

    classSearch(term: string, subject: string, course?: string, campus?: string): Promise<Response>;
    
    catalogSearch(term: string, subject: string, offset?: number, pageSize?: number): Promise<Response>;
}

// Private functions and types (not exported)
declare namespace private {
    function getCookie(school: string, term: number | string): Promise<string[]>;

    function bannerRequest(
        school: string,
        method: string,
        params?: Record<string, any>,
        needsCookie?: boolean
    ): Promise<{ Response: IncomingMessage, Body: any }>;

    function promiseRequest(url: string): Promise<{ Response: IncomingMessage, Body: any }>;

    function batchRequest(
        batchSize: number,
        pageSize: number,
        batch: number,
        method: string,
        school: string,
        requestParams?: Record<string, any>,
    ): Promise<any[]>;
}

// Export the BannerJS class as the default export
export = BannerJS;
