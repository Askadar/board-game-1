"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterNotInArray = void 0;
const filterNotInArray = (array, comparator = (a, b) => a === b) => (item, _, arr) => array.findIndex((existingItem) => comparator(item, existingItem)) === -1;
exports.filterNotInArray = filterNotInArray;
