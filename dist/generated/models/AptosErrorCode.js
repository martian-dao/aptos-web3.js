"use strict";
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosErrorCode = void 0;
/**
 * These codes provide more granular error information beyond just the HTTP
 * status code of the response.
 */
var AptosErrorCode;
(function (AptosErrorCode) {
    AptosErrorCode["ACCOUNT_NOT_FOUND"] = "account_not_found";
    AptosErrorCode["RESOURCE_NOT_FOUND"] = "resource_not_found";
    AptosErrorCode["MODULE_NOT_FOUND"] = "module_not_found";
    AptosErrorCode["STRUCT_FIELD_NOT_FOUND"] = "struct_field_not_found";
    AptosErrorCode["VERSION_NOT_FOUND"] = "version_not_found";
    AptosErrorCode["TRANSACTION_NOT_FOUND"] = "transaction_not_found";
    AptosErrorCode["TABLE_ITEM_NOT_FOUND"] = "table_item_not_found";
    AptosErrorCode["BLOCK_NOT_FOUND"] = "block_not_found";
    AptosErrorCode["VERSION_PRUNED"] = "version_pruned";
    AptosErrorCode["BLOCK_PRUNED"] = "block_pruned";
    AptosErrorCode["INVALID_INPUT"] = "invalid_input";
    AptosErrorCode["INVALID_TRANSACTION_UPDATE"] = "invalid_transaction_update";
    AptosErrorCode["SEQUENCE_NUMBER_TOO_OLD"] = "sequence_number_too_old";
    AptosErrorCode["VM_ERROR"] = "vm_error";
    AptosErrorCode["HEALTH_CHECK_FAILED"] = "health_check_failed";
    AptosErrorCode["MEMPOOL_IS_FULL"] = "mempool_is_full";
    AptosErrorCode["INTERNAL_ERROR"] = "internal_error";
    AptosErrorCode["WEB_FRAMEWORK_ERROR"] = "web_framework_error";
    AptosErrorCode["BCS_NOT_SUPPORTED"] = "bcs_not_supported";
    AptosErrorCode["API_DISABLED"] = "api_disabled";
})(AptosErrorCode = exports.AptosErrorCode || (exports.AptosErrorCode = {}));
//# sourceMappingURL=AptosErrorCode.js.map