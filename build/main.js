/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/mod/filesOperations.ts":
/*!************************************!*\
  !*** ./src/mod/filesOperations.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   loadTranslationsFilesContent: () => (/* binding */ loadTranslationsFilesContent),
/* harmony export */   parseJsFileContent: () => (/* binding */ parseJsFileContent)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);


const parseJsFileContent = (content)=>{
    let cleaned = content.replace(/^\s*export\s+default\s+/, '').trim();
    if (cleaned.endsWith(';')) {
        cleaned = cleaned.slice(0, -1);
    }
    const wrapped = `(${cleaned})`;
    try {
        return new Function(`return ${wrapped}`)();
    } catch (error) {
        throw new Error(`Błąd parsowania zawartości pliku JS: ${error}`);
    }
};
const loadTranslationsFilesContent = async (filePaths)=>{
    const entries = await Promise.all(filePaths.map(async (filePath)=>{
        const ext = path__WEBPACK_IMPORTED_MODULE_1___default().extname(filePath);
        try {
            const content = await fs__WEBPACK_IMPORTED_MODULE_0__.promises.readFile(filePath, 'utf8');
            const parsed = ext === '.json' ? JSON.parse(content) : parseJsFileContent(content);
            return [
                filePath,
                parsed
            ];
        } catch (error) {
            console.error(`Błąd ładowania pliku ${filePath}:`, error);
            return [
                filePath,
                null
            ];
        }
    }));
    return Object.fromEntries(entries);
};


/***/ }),

/***/ "./src/mod/filesTravel.ts":
/*!********************************!*\
  !*** ./src/mod/filesTravel.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   findTranslationsTargetFiles: () => (/* binding */ findTranslationsTargetFiles),
/* harmony export */   getAllProjectFiles: () => (/* binding */ getAllProjectFiles)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);


const findTranslationsTargetFiles = async (baseDir, indexFolders, jsonFileNames)=>{
    const results = [];
    const traverse = async (currentDir)=>{
        let entries;
        try {
            entries = await fs__WEBPACK_IMPORTED_MODULE_0__.promises.readdir(currentDir, {
                withFileTypes: true
            });
        } catch (error) {
            console.error(`Błąd odczytu katalogu ${currentDir}:`, error);
            return;
        }
        const dirPromises = [];
        for (const entry of entries){
            const fullPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(currentDir, entry.name);
            if (entry.isDirectory()) {
                dirPromises.push(traverse(fullPath));
            } else if (entry.isFile()) {
                if (entry.name === 'index.js') {
                    const parentDirName = path__WEBPACK_IMPORTED_MODULE_1___default().basename(currentDir);
                    if (indexFolders.includes(parentDirName)) {
                        results.push(fullPath);
                    }
                } else if (entry.name.endsWith('.json') && jsonFileNames.includes(entry.name)) {
                    results.push(fullPath);
                }
            }
        }
        await Promise.all(dirPromises);
    };
    await traverse(baseDir);
    return results;
};
async function getAllProjectFiles(dir, allowedExtensions, excludedFolders) {
    const results = [];
    let entries;
    try {
        entries = await fs__WEBPACK_IMPORTED_MODULE_0__.promises.readdir(dir, {
            withFileTypes: true
        });
    } catch (err) {
        console.error(`Błąd odczytu katalogu ${dir}:`, err);
        return results;
    }
    const subDirPromises = [];
    for (const entry of entries){
        const fullPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(dir, entry.name);
        if (entry.isDirectory()) {
            if (excludedFolders.includes(entry.name)) continue;
            subDirPromises.push(getAllProjectFiles(fullPath, allowedExtensions, excludedFolders));
        } else if (entry.isFile()) {
            const ext = path__WEBPACK_IMPORTED_MODULE_1___default().extname(entry.name);
            if (allowedExtensions.includes(ext)) {
                results.push(fullPath);
            }
        }
    }
    const subDirResults = await Promise.all(subDirPromises);
    for (const subResult of subDirResults){
        results.push(...subResult);
    }
    return results;
}


/***/ }),

/***/ "./src/mod/objectTransform.ts":
/*!************************************!*\
  !*** ./src/mod/objectTransform.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   flattenKeys: () => (/* binding */ flattenKeys)
/* harmony export */ });
const flattenKeys = (obj, prefix = '', result = [])=>{
    for(const key in obj){
        if (!Object.hasOwn(obj, key)) continue;
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            flattenKeys(value, fullKey, result);
        } else {
            result.push(fullKey);
        }
    }
    return result;
};


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _mod_filesTravel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mod/filesTravel */ "./src/mod/filesTravel.ts");
/* harmony import */ var _mod_filesOperations__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./mod/filesOperations */ "./src/mod/filesOperations.ts");
/* harmony import */ var _mod_objectTransform__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mod/objectTransform */ "./src/mod/objectTransform.ts");





const main = async ()=>{
    const args = process.argv.slice(2);
    const isLive = args[0] === 'live';
    const pathTest = '/src/testData';
    const pathLive = '/app/javascript/apps';
    const baseDir = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), isLive ? pathLive : pathTest);
    const indexFolders = [
        'pl_PL',
        'en_GB',
        'lt_LT',
        'uk_UA',
        'cs_CZ'
    ];
    const jsonFileNames = [
        'pl.json',
        'en.json',
        'cs.json',
        'uk.json'
    ];
    const allowedExtensions = [
        '.js',
        '.ts',
        '.vue'
    ];
    const ignoreDirectories = [
        'node_modules',
        ...indexFolders
    ];
    try {
        // Step 1: Find all translations files
        const filesWithTranslations = await (0,_mod_filesTravel__WEBPACK_IMPORTED_MODULE_2__.findTranslationsTargetFiles)(baseDir, indexFolders, jsonFileNames);
        console.log('Znalezione pliki z tłumaczeniami:');
        console.log(filesWithTranslations);
        console.log('-------------------------------- \n\n');
        // Step 2: Load and process translations files
        const contents = await (0,_mod_filesOperations__WEBPACK_IMPORTED_MODULE_3__.loadTranslationsFilesContent)(filesWithTranslations);
        // Step 3: Get all project files and their contents
        console.log(`Przeszukanie katalogu ${baseDir} \n\n`);
        const projectFiles = await (0,_mod_filesTravel__WEBPACK_IMPORTED_MODULE_2__.getAllProjectFiles)(baseDir, allowedExtensions, ignoreDirectories);
        const projectFilesContents = await Promise.all(projectFiles.map(async (file)=>{
            try {
                const text = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(file, 'utf-8');
                return {
                    file,
                    text
                };
            } catch (err) {
                return {
                    file,
                    text: ''
                };
            }
        }));
        // Step 4: Flatten keys and find unused keys
        let counter = 0;
        for(const filePath in contents){
            if (!Object.hasOwn(contents, filePath)) {
                continue;
            }
            const fileContent = contents[filePath];
            const keys = (0,_mod_objectTransform__WEBPACK_IMPORTED_MODULE_4__.flattenKeys)(fileContent);
            const unusedKeys = [];
            for (const key of keys){
                const onlyKeyToCheck = key.split('.').pop();
                let isUsed = false;
                for (const { text } of projectFilesContents){
                    if (text.includes(onlyKeyToCheck)) {
                        isUsed = true;
                        break;
                    }
                }
                if (!isUsed) {
                    unusedKeys.push(onlyKeyToCheck);
                    counter++;
                }
            }
            console.log(`Niezastosowane klucze w pliku ${filePath}:`);
            console.log(unusedKeys);
            console.log('-------------------------------- \n\n');
        }
        console.log(`\n Znaleziono ${counter} niezastosowanych kluczy`);
    } catch (err) {
        console.error('Błąd podczas przeszukiwania:', err);
    }
};
main();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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b0JBQzNDLElBQUlFLEtBQUtsQyxRQUFRLENBQUN1QyxpQkFBa0I7d0JBQ2xDRyxTQUFTO3dCQUNUO29CQUNGO2dCQUNGO2dCQUVBLElBQUksQ0FBQ0EsUUFBUTtvQkFDWEosV0FBVzFDLElBQUksQ0FBQzJDO29CQUNoQko7Z0JBQ0Y7WUFDRjtZQUVBekQsUUFBUW1ELEdBQUcsQ0FBQyxDQUFDLDhCQUE4QixFQUFFMUQsU0FBUyxDQUFDLENBQUM7WUFDeERPLFFBQVFtRCxHQUFHLENBQUNTO1lBQ1o1RCxRQUFRbUQsR0FBRyxDQUFDO1FBQ2Q7UUFFQW5ELFFBQVFtRCxHQUFHLENBQUMsQ0FBQyxjQUFjLEVBQUVNLFFBQVEsd0JBQXdCLENBQUM7SUFDaEUsRUFBRSxPQUFPOUIsS0FBSztRQUNaM0IsUUFBUWYsS0FBSyxDQUFDLGdDQUFnQzBDO0lBQ2hEO0FBQ0Y7QUFFQWMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sb2NhbGVzLWtleS1oZWxwZXIvLi9zcmMvbW9kL2ZpbGVzT3BlcmF0aW9ucy50cyIsIndlYnBhY2s6Ly9sb2NhbGVzLWtleS1oZWxwZXIvLi9zcmMvbW9kL2ZpbGVzVHJhdmVsLnRzIiwid2VicGFjazovL2xvY2FsZXMta2V5LWhlbHBlci8uL3NyYy9tb2Qvb2JqZWN0VHJhbnNmb3JtLnRzIiwid2VicGFjazovL2xvY2FsZXMta2V5LWhlbHBlci9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwiZnNcIiIsIndlYnBhY2s6Ly9sb2NhbGVzLWtleS1oZWxwZXIvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcInBhdGhcIiIsIndlYnBhY2s6Ly9sb2NhbGVzLWtleS1oZWxwZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbG9jYWxlcy1rZXktaGVscGVyL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2xvY2FsZXMta2V5LWhlbHBlci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbG9jYWxlcy1rZXktaGVscGVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbG9jYWxlcy1rZXktaGVscGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbG9jYWxlcy1rZXktaGVscGVyLy4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGNvbnN0IHBhcnNlSnNGaWxlQ29udGVudCA9IChjb250ZW50OiBzdHJpbmcpOiBhbnkgPT4ge1xuICBsZXQgY2xlYW5lZCA9IGNvbnRlbnQucmVwbGFjZSgvXlxccypleHBvcnRcXHMrZGVmYXVsdFxccysvLCAnJykudHJpbSgpO1xuXG4gIGlmIChjbGVhbmVkLmVuZHNXaXRoKCc7JykpIHtcbiAgICBjbGVhbmVkID0gY2xlYW5lZC5zbGljZSgwLCAtMSk7XG4gIH1cblxuICBjb25zdCB3cmFwcGVkID0gYCgke2NsZWFuZWR9KWA7XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGByZXR1cm4gJHt3cmFwcGVkfWApKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBCxYLEhWQgcGFyc293YW5pYSB6YXdhcnRvxZtjaSBwbGlrdSBKUzogJHtlcnJvcn1gKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGxvYWRUcmFuc2xhdGlvbnNGaWxlc0NvbnRlbnQgPSBhc3luYyAoZmlsZVBhdGhzOiBzdHJpbmdbXSk6IFByb21pc2U8eyBbZmlsZVBhdGg6IHN0cmluZ106IGFueSB9PiA9PiB7XG4gIGNvbnN0IGVudHJpZXMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICBmaWxlUGF0aHMubWFwKGFzeW5jIChmaWxlUGF0aCkgPT4ge1xuICAgICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKGZpbGVQYXRoKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBhd2FpdCBmcy5yZWFkRmlsZShmaWxlUGF0aCwgJ3V0ZjgnKTtcbiAgICAgICAgY29uc3QgcGFyc2VkID0gZXh0ID09PSAnLmpzb24nXG4gICAgICAgICAgPyBKU09OLnBhcnNlKGNvbnRlbnQpXG4gICAgICAgICAgOiBwYXJzZUpzRmlsZUNvbnRlbnQoY29udGVudCk7XG5cbiAgICAgICAgcmV0dXJuIFtmaWxlUGF0aCwgcGFyc2VkXSBhcyBbc3RyaW5nLCBhbnldO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgQsWCxIVkIMWCYWRvd2FuaWEgcGxpa3UgJHtmaWxlUGF0aH06YCwgZXJyb3IpO1xuICAgICAgICByZXR1cm4gW2ZpbGVQYXRoLCBudWxsXSBhcyBbc3RyaW5nLCBhbnldO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG5cbiAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhlbnRyaWVzKTtcbn07XG4iLCJpbXBvcnQgeyBwcm9taXNlcyBhcyBmcyB9IGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgY29uc3QgZmluZFRyYW5zbGF0aW9uc1RhcmdldEZpbGVzID0gYXN5bmMgKFxuICBiYXNlRGlyOiBzdHJpbmcsXG4gIGluZGV4Rm9sZGVyczogc3RyaW5nW10sXG4gIGpzb25GaWxlTmFtZXM6IHN0cmluZ1tdXG4pOiBQcm9taXNlPHN0cmluZ1tdPiA9PiB7XG4gIGNvbnN0IHJlc3VsdHM6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3QgdHJhdmVyc2UgPSBhc3luYyAoY3VycmVudERpcjogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgbGV0IGVudHJpZXM7XG4gICAgdHJ5IHtcbiAgICAgIGVudHJpZXMgPSBhd2FpdCBmcy5yZWFkZGlyKGN1cnJlbnREaXIsIHsgd2l0aEZpbGVUeXBlczogdHJ1ZSB9KTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgQsWCxIVkIG9kY3p5dHUga2F0YWxvZ3UgJHtjdXJyZW50RGlyfTpgLCBlcnJvcik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGlyUHJvbWlzZXM6IFByb21pc2U8dm9pZD5bXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzKSB7XG4gICAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihjdXJyZW50RGlyLCBlbnRyeS5uYW1lKTtcblxuICAgICAgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgZGlyUHJvbWlzZXMucHVzaCh0cmF2ZXJzZShmdWxsUGF0aCkpO1xuICAgICAgfSBlbHNlIGlmIChlbnRyeS5pc0ZpbGUoKSkge1xuICAgICAgICBpZiAoZW50cnkubmFtZSA9PT0gJ2luZGV4LmpzJykge1xuICAgICAgICAgIGNvbnN0IHBhcmVudERpck5hbWUgPSBwYXRoLmJhc2VuYW1lKGN1cnJlbnREaXIpO1xuICAgICAgICAgIGlmIChpbmRleEZvbGRlcnMuaW5jbHVkZXMocGFyZW50RGlyTmFtZSkpIHtcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaChmdWxsUGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGVudHJ5Lm5hbWUuZW5kc1dpdGgoJy5qc29uJykgJiYganNvbkZpbGVOYW1lcy5pbmNsdWRlcyhlbnRyeS5uYW1lKSkge1xuICAgICAgICAgIHJlc3VsdHMucHVzaChmdWxsUGF0aCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBhd2FpdCBQcm9taXNlLmFsbChkaXJQcm9taXNlcyk7XG4gIH1cblxuICBhd2FpdCB0cmF2ZXJzZShiYXNlRGlyKTtcbiAgcmV0dXJuIHJlc3VsdHM7XG59O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0QWxsUHJvamVjdEZpbGVzKFxuICBkaXI6IHN0cmluZyxcbiAgYWxsb3dlZEV4dGVuc2lvbnM6IHN0cmluZ1tdLFxuICBleGNsdWRlZEZvbGRlcnM6IHN0cmluZ1tdXG4pOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gIGNvbnN0IHJlc3VsdHM6IHN0cmluZ1tdID0gW107XG4gIGxldCBlbnRyaWVzO1xuXG4gIHRyeSB7XG4gICAgZW50cmllcyA9IGF3YWl0IGZzLnJlYWRkaXIoZGlyLCB7IHdpdGhGaWxlVHlwZXM6IHRydWUgfSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGNvbnNvbGUuZXJyb3IoYELFgsSFZCBvZGN6eXR1IGthdGFsb2d1ICR7ZGlyfTpgLCBlcnIpO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgY29uc3Qgc3ViRGlyUHJvbWlzZXM6IFByb21pc2U8c3RyaW5nW10+W10gPSBbXTtcblxuICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICBjb25zdCBmdWxsUGF0aCA9IHBhdGguam9pbihkaXIsIGVudHJ5Lm5hbWUpO1xuXG4gICAgaWYgKGVudHJ5LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgIGlmIChleGNsdWRlZEZvbGRlcnMuaW5jbHVkZXMoZW50cnkubmFtZSkpIGNvbnRpbnVlO1xuICAgICAgc3ViRGlyUHJvbWlzZXMucHVzaChnZXRBbGxQcm9qZWN0RmlsZXMoZnVsbFBhdGgsIGFsbG93ZWRFeHRlbnNpb25zLCBleGNsdWRlZEZvbGRlcnMpKTtcbiAgICB9IGVsc2UgaWYgKGVudHJ5LmlzRmlsZSgpKSB7XG4gICAgICBjb25zdCBleHQgPSBwYXRoLmV4dG5hbWUoZW50cnkubmFtZSk7XG4gICAgICBpZiAoYWxsb3dlZEV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0KSkge1xuICAgICAgICByZXN1bHRzLnB1c2goZnVsbFBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN1YkRpclJlc3VsdHMgPSBhd2FpdCBQcm9taXNlLmFsbChzdWJEaXJQcm9taXNlcyk7XG4gIGZvciAoY29uc3Qgc3ViUmVzdWx0IG9mIHN1YkRpclJlc3VsdHMpIHtcbiAgICByZXN1bHRzLnB1c2goLi4uc3ViUmVzdWx0KTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHRzO1xufVxuIiwiZXhwb3J0IGNvbnN0IGZsYXR0ZW5LZXlzID0gKFxuICBvYmo6IGFueSxcbiAgcHJlZml4OiBzdHJpbmcgPSAnJyxcbiAgcmVzdWx0OiBzdHJpbmdbXSA9IFtdXG4pOiBzdHJpbmdbXSA9PiB7XG4gIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xuICAgIGlmICghT2JqZWN0Lmhhc093bihvYmosIGtleSkpIGNvbnRpbnVlO1xuICAgIGNvbnN0IGZ1bGxLZXkgPSBwcmVmaXggPyBgJHtwcmVmaXh9LiR7a2V5fWAgOiBrZXk7XG4gICAgY29uc3QgdmFsdWUgPSBvYmpba2V5XTtcbiAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGZsYXR0ZW5LZXlzKHZhbHVlLCBmdWxsS2V5LCByZXN1bHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXN1bHQucHVzaChmdWxsS2V5KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZnNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBwcm9taXNlcyBhcyBmcyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGZpbmRUcmFuc2xhdGlvbnNUYXJnZXRGaWxlcywgZ2V0QWxsUHJvamVjdEZpbGVzIH0gZnJvbSAnLi9tb2QvZmlsZXNUcmF2ZWwnO1xuaW1wb3J0IHsgbG9hZFRyYW5zbGF0aW9uc0ZpbGVzQ29udGVudCB9IGZyb20gJy4vbW9kL2ZpbGVzT3BlcmF0aW9ucyc7XG5pbXBvcnQgeyBmbGF0dGVuS2V5cyB9IGZyb20gJy4vbW9kL29iamVjdFRyYW5zZm9ybSc7XG5cbmNvbnN0IG1haW4gPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gIGNvbnN0IGFyZ3MgPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7XG4gIGNvbnN0IGlzTGl2ZSA9IGFyZ3NbMF0gPT09ICdsaXZlJztcblxuICBjb25zdCBwYXRoVGVzdCA9ICcvc3JjL3Rlc3REYXRhJztcbiAgY29uc3QgcGF0aExpdmUgPSAnL2FwcC9qYXZhc2NyaXB0L2FwcHMnO1xuICBjb25zdCBiYXNlRGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGlzTGl2ZSA/IHBhdGhMaXZlIDogcGF0aFRlc3QpO1xuXG4gIGNvbnN0IGluZGV4Rm9sZGVycyA9IFsncGxfUEwnLCAnZW5fR0InLCAnbHRfTFQnLCAndWtfVUEnLCAnY3NfQ1onXTtcbiAgY29uc3QganNvbkZpbGVOYW1lcyA9IFsncGwuanNvbicsICdlbi5qc29uJywgJ2NzLmpzb24nLCAndWsuanNvbiddO1xuICBjb25zdCBhbGxvd2VkRXh0ZW5zaW9ucyA9IFsnLmpzJywgJy50cycsICcudnVlJ107XG4gIGNvbnN0IGlnbm9yZURpcmVjdG9yaWVzID0gWydub2RlX21vZHVsZXMnLCAuLi5pbmRleEZvbGRlcnNdO1xuXG4gIHRyeSB7XG4gICAgLy8gU3RlcCAxOiBGaW5kIGFsbCB0cmFuc2xhdGlvbnMgZmlsZXNcbiAgICBjb25zdCBmaWxlc1dpdGhUcmFuc2xhdGlvbnMgPSBhd2FpdCBmaW5kVHJhbnNsYXRpb25zVGFyZ2V0RmlsZXMoYmFzZURpciwgaW5kZXhGb2xkZXJzLCBqc29uRmlsZU5hbWVzKVxuICAgIGNvbnNvbGUubG9nKCdabmFsZXppb25lIHBsaWtpIHogdMWCdW1hY3plbmlhbWk6Jyk7XG4gICAgY29uc29sZS5sb2coZmlsZXNXaXRoVHJhbnNsYXRpb25zKTtcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXFxuXFxuJyk7XG5cbiAgICAvLyBTdGVwIDI6IExvYWQgYW5kIHByb2Nlc3MgdHJhbnNsYXRpb25zIGZpbGVzXG4gICAgY29uc3QgY29udGVudHMgPSBhd2FpdCBsb2FkVHJhbnNsYXRpb25zRmlsZXNDb250ZW50KGZpbGVzV2l0aFRyYW5zbGF0aW9ucyk7XG5cbiAgICAvLyBTdGVwIDM6IEdldCBhbGwgcHJvamVjdCBmaWxlcyBhbmQgdGhlaXIgY29udGVudHNcbiAgICBjb25zb2xlLmxvZyhgUHJ6ZXN6dWthbmllIGthdGFsb2d1ICR7YmFzZURpcn0gXFxuXFxuYCk7XG4gICAgY29uc3QgcHJvamVjdEZpbGVzID0gYXdhaXQgZ2V0QWxsUHJvamVjdEZpbGVzKGJhc2VEaXIsIGFsbG93ZWRFeHRlbnNpb25zLCBpZ25vcmVEaXJlY3Rvcmllcyk7XG4gICAgY29uc3QgcHJvamVjdEZpbGVzQ29udGVudHMgPSBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgIHByb2plY3RGaWxlcy5tYXAoYXN5bmMgKGZpbGUpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB0ZXh0ID0gYXdhaXQgZnMucmVhZEZpbGUoZmlsZSwgJ3V0Zi04Jyk7XG4gICAgICAgICAgcmV0dXJuIHsgZmlsZSwgdGV4dCB9O1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4geyBmaWxlLCB0ZXh0OiAnJyB9O1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICk7XG5cbiAgICAvLyBTdGVwIDQ6IEZsYXR0ZW4ga2V5cyBhbmQgZmluZCB1bnVzZWQga2V5c1xuICAgIGxldCBjb3VudGVyID0gMDtcbiAgICBmb3IgKGNvbnN0IGZpbGVQYXRoIGluIGNvbnRlbnRzKSB7XG4gICAgICBpZiAoIU9iamVjdC5oYXNPd24oY29udGVudHMsIGZpbGVQYXRoKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSBjb250ZW50c1tmaWxlUGF0aF07XG4gICAgICBjb25zdCBrZXlzID0gZmxhdHRlbktleXMoZmlsZUNvbnRlbnQpO1xuICAgICAgY29uc3QgdW51c2VkS2V5czogc3RyaW5nW10gPSBbXTtcblxuICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgICBjb25zdCBvbmx5S2V5VG9DaGVjayA9IGtleS5zcGxpdCgnLicpLnBvcCgpO1xuICAgICAgICBsZXQgaXNVc2VkID0gZmFsc2U7XG4gICAgICAgIGZvciAoY29uc3QgeyB0ZXh0IH0gb2YgcHJvamVjdEZpbGVzQ29udGVudHMpIHtcbiAgICAgICAgICBpZiAodGV4dC5pbmNsdWRlcyhvbmx5S2V5VG9DaGVjayEpKSB7XG4gICAgICAgICAgICBpc1VzZWQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1VzZWQpIHtcbiAgICAgICAgICB1bnVzZWRLZXlzLnB1c2gob25seUtleVRvQ2hlY2shKTtcbiAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coYE5pZXphc3Rvc293YW5lIGtsdWN6ZSB3IHBsaWt1ICR7ZmlsZVBhdGh9OmApO1xuICAgICAgY29uc29sZS5sb2codW51c2VkS2V5cyk7XG4gICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXFxuXFxuJyk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYFxcbiBabmFsZXppb25vICR7Y291bnRlcn0gbmllemFzdG9zb3dhbnljaCBrbHVjenlgKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5lcnJvcignQsWCxIVkIHBvZGN6YXMgcHJ6ZXN6dWtpd2FuaWE6JywgZXJyKTtcbiAgfVxufTtcblxubWFpbigpO1xuIl0sIm5hbWVzIjpbInByb21pc2VzIiwiZnMiLCJwYXRoIiwicGFyc2VKc0ZpbGVDb250ZW50IiwiY29udGVudCIsImNsZWFuZWQiLCJyZXBsYWNlIiwidHJpbSIsImVuZHNXaXRoIiwic2xpY2UiLCJ3cmFwcGVkIiwiRnVuY3Rpb24iLCJlcnJvciIsIkVycm9yIiwibG9hZFRyYW5zbGF0aW9uc0ZpbGVzQ29udGVudCIsImZpbGVQYXRocyIsImVudHJpZXMiLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiZmlsZVBhdGgiLCJleHQiLCJleHRuYW1lIiwicmVhZEZpbGUiLCJwYXJzZWQiLCJKU09OIiwicGFyc2UiLCJjb25zb2xlIiwiT2JqZWN0IiwiZnJvbUVudHJpZXMiLCJmaW5kVHJhbnNsYXRpb25zVGFyZ2V0RmlsZXMiLCJiYXNlRGlyIiwiaW5kZXhGb2xkZXJzIiwianNvbkZpbGVOYW1lcyIsInJlc3VsdHMiLCJ0cmF2ZXJzZSIsImN1cnJlbnREaXIiLCJyZWFkZGlyIiwid2l0aEZpbGVUeXBlcyIsImRpclByb21pc2VzIiwiZW50cnkiLCJmdWxsUGF0aCIsImpvaW4iLCJuYW1lIiwiaXNEaXJlY3RvcnkiLCJwdXNoIiwiaXNGaWxlIiwicGFyZW50RGlyTmFtZSIsImJhc2VuYW1lIiwiaW5jbHVkZXMiLCJnZXRBbGxQcm9qZWN0RmlsZXMiLCJkaXIiLCJhbGxvd2VkRXh0ZW5zaW9ucyIsImV4Y2x1ZGVkRm9sZGVycyIsImVyciIsInN1YkRpclByb21pc2VzIiwic3ViRGlyUmVzdWx0cyIsInN1YlJlc3VsdCIsImZsYXR0ZW5LZXlzIiwib2JqIiwicHJlZml4IiwicmVzdWx0Iiwia2V5IiwiaGFzT3duIiwiZnVsbEtleSIsInZhbHVlIiwiQXJyYXkiLCJpc0FycmF5IiwibWFpbiIsImFyZ3MiLCJwcm9jZXNzIiwiYXJndiIsImlzTGl2ZSIsInBhdGhUZXN0IiwicGF0aExpdmUiLCJjd2QiLCJpZ25vcmVEaXJlY3RvcmllcyIsImZpbGVzV2l0aFRyYW5zbGF0aW9ucyIsImxvZyIsImNvbnRlbnRzIiwicHJvamVjdEZpbGVzIiwicHJvamVjdEZpbGVzQ29udGVudHMiLCJmaWxlIiwidGV4dCIsImNvdW50ZXIiLCJmaWxlQ29udGVudCIsImtleXMiLCJ1bnVzZWRLZXlzIiwib25seUtleVRvQ2hlY2siLCJzcGxpdCIsInBvcCIsImlzVXNlZCJdLCJzb3VyY2VSb290IjoiIn0=