export type Evaluation = {
    /**
     * - A unique identifier generated by Rize
     */
    uid: string;
    outcome: 'approved' | 'manual_review' | 'denied';
    created_at: string;
    /**
     * A mapping of categories to outcomes for those categories. Items are defined as: key -
     * The category name; value - true if all tags returned from our KYC partner have a
     * positive "polarity" in the context of the service offering for which this evaluation was run, false otherwise
     */
    flags: any;
    /**
     * A mapping of KYC categories to results returned from various services queried by our KYC partner.
     * Items are defined as follows: key - The category name; value - true if all services queried by our
     * KYC partner returned a value of "matched" for this category, false otherwise
     */
    pii_match: any;
};
export type EvaluationListQuery = {
    /**
     * - Filter by Customer. Multiple values are allowed
     */
    customer_uid?: Array<string>;
    /**
     * - Return only the latest evaluation
     */
    latest?: boolean;
};
