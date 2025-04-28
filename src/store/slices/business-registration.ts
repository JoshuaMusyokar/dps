// src/redux/slices/registrationSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BusinessRegistrationData,
  BusinessType,
  LicenseType,
  DocumentFile,
} from "../../types";

const initialState: BusinessRegistrationData = {
  // Step 1: Business Details
  businessName: "",
  tradingName: "",
  address: "",
  city: "",
  postalCode: "",
  country: "Kenya",
  businessType: "",
  taxId: "",
  licenseType: "",
  otherLicenseType: "",
  documents: [],
  industry: "",
  yearEstablished: "",
  employeeCount: "",

  // Step 2: Owner Info
  ownerFirstName: "",
  ownerLastName: "",
  ownerIdNumber: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerAddress: "",
  ownerDocuments: [],

  // Step 3: Bank Details
  bankName: "",
  accountNumber: "",
  branchCode: "",
  swiftCode: "",
  statementDocument: null,

  // Form state
  currentStep: 1,
  formErrors: {},
  isSubmitting: false,
  draftSaved: false,
};

export const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;
      // @ts-ignore: Dynamic field assignment
      state[field] = value;
    },

    clearError: (state, action: PayloadAction<string>) => {
      const field = action.payload;
      if (state.formErrors[field]) {
        delete state.formErrors[field];
      }
    },

    setErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.formErrors = action.payload;
    },

    addDocument: (state, action: PayloadAction<DocumentFile>) => {
      state.documents.push(action.payload);
    },

    removeDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(
        (doc) => doc.id !== action.payload
      );
    },

    addOwnerDocument: (state, action: PayloadAction<DocumentFile>) => {
      state.ownerDocuments.push(action.payload);
    },

    removeOwnerDocument: (state, action: PayloadAction<string>) => {
      state.ownerDocuments = state.ownerDocuments.filter(
        (doc) => doc.id !== action.payload
      );
    },

    setStatementDocument: (
      state,
      action: PayloadAction<DocumentFile | null>
    ) => {
      state.statementDocument = action.payload;
    },

    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },

    saveDraft: (state) => {
      state.draftSaved = true;
    },

    resetForm: () => initialState,
  },
});

export const {
  setField,
  clearError,
  setErrors,
  addDocument,
  removeDocument,
  addOwnerDocument,
  removeOwnerDocument,
  setStatementDocument,
  setCurrentStep,
  setSubmitting,
  saveDraft,
  resetForm,
} = registrationSlice.actions;

export const registrationReducer = registrationSlice.reducer;
