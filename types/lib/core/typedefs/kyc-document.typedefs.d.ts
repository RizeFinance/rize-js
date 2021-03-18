export type KYCDocument = {
    /**
     * - A unique identifier generated by Rize.
     */
    uid: string;
    /**
     * - The KYC document type.
     */
    type: 'contract' | 'license' | 'other' | 'passport' | 'utility';
    /**
     * - The name of this file, exclusive of any extension.
     */
    filename: string;
    /**
     * - A note describing the document.
     */
    note: string;
    /**
     * - The filename extension.
     */
    extension: string;
    /**
     * - The date and time when the document became available
     */
    created_at: string;
};
export type KYCDocumentListQuery = {
    /**
     * - The UID associated with a given KYC evaluation.
     */
    evaluation_uid: string;
};