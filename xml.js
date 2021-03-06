module.exports = class XML {};

class XMLParsingError extends Error {}

/**
 * Similarly to JSON.stringify, this method returns the XML equivalent of the object passed to it.
 * @param {any} obj
 */
function stringify(obj) {
    var result = "";

    if(typeof obj !== "object")
        throw new TypeError("\"object\" argument is not of type `object`");

    for(var [key, val] of Object.entries(obj)) {
        if(typeof val === "object")
            result += `<${key}>${stringify(val)}</${key}>`;
        else
            result += `<${key}>${val}</${key}>`;
    }

    return result;
}

/**
 * Similarly to JSON.parse, this method parses the given string as XML
 * @param {string} text 
 * @param {{
 *  parseChildren?: boolean,
 *  getAttributes?: boolean,
 *  disallowUnexpectedTokenError?: boolean
 * }} options Options
 * @returns {{ value?: string, attributes: any[] }|{}|{}[]}
 */
function parse(text, options = { parseChildren: true, getAttributes: true }) {
    if(text === undefined)
        return new TypeError("Required parameter \"text\" is undefined");
    if(typeof text !== "string")
        return new TypeError("Parameter \"text\" isn't a string");

    if(options.parseChildren === undefined)
        options.parseChildren = true;

    if(options.getAttributes === undefined)
        options.getAttributes = true;
    

    text = text.replace(/<\?xml.*\?>/, "").replace(/ *\n/g, "").replace(/\t/g, " ").replace(/> +</g, "><");

    const regex = /<([A-z|_|-]*[\d]*)( [A-z]*[\d]*=".*")*>(.*?)<\/\1>/;

    if(!options.disallowUnexpectedTokenError) {
        const unexpectedTokens = text.replace(new RegExp(regex, "g"), "");
        if(unexpectedTokens)
            throw new XMLParsingError("Unexpected tokens: " + unexpectedTokens);
    }

    const rawAttributes = {};

    const raw = (text
            .replace(/  /g, " ")
            .replace(/\n/g, "")
            .match(new RegExp(regex, "g")) || []).map(el => {
                const match = el.match(regex);
                const result = {};

                const key = match[1];
                const attrMatch = (match[2] || "").trimStart();

                rawAttributes[key] = attrMatch;

                if(result[key])
                    if(result[key].prototype === Array.prototype)
                        result[key].push(match[3]);
                    else
                        result[key] = [result[key], match[3]];
                else
                    result[key] = match[3];

                return result;
            });

    if(!raw.length)
        throw new XMLParsingError("Given text has no keys!");

    if(!options.parseChildren)
        return raw;
    
    const result = {};

    for(const obj of raw) {
        for(var [key, value] of Object.entries(obj)) {
            value = value.trim();

            const parsed = validate(value);
            const attributes = {};

            if(options.getAttributes) {
                const rawAttr = rawAttributes[key];

                if(rawAttr) {
                    console.log(rawAttr);

                    const raw = Array.from(rawAttr.match(/(.*?)="(.*?)"/g));

                    console.log(raw);
                    
                    for(const rawElement of raw) {
                        const element = Array.from(rawElement.match(/(.*?)="(.*?)"/));

                        attributes[element[1].trimStart()] = element[2];
                    }
                }
            }

            if(parsed) {
                if(options.getAttributes) {
                    const rawAttr = rawAttributes[key];

                    if(rawAttr)
                        parsed.attributes = attributes;
                }

                if(typeof result[key]?.push === "function")
                    result[key].push(parsed);
                else
                    result[key] = parsed;
            } else {
                if(result[key]) {
                    if(typeof result[key].push === "function")
                        result[key].push({ value, attributes });
                    else
                        result[key] = [result[key], { value, attributes }];
                } else
                    result[key] = {
                        value,
                        attributes
                    };
            }
        }
    }

    return result;
}

/**
 * Validate XML
 * @param {string} text 
 * @returns {{}|false}
 */
function validate(text) {
    try {
        return parse(text);
    } catch {
        return false;
    }
}

/**
 * Convert XML to JSON
 * @param {string} text 
 */
function xmlToJson(text) {
    return JSON.stringify(parse(text));
}

/**
 * Convert JSON to XML
 * @param {string} text 
 */
function jsonToXml(text) {
    return stringify(JSON.parse(text));
}

module.exports.stringify = stringify;
module.exports.parse = parse;
module.exports.validate = validate;
module.exports.xmlToJson = xmlToJson;
module.exports.jsonToXml = jsonToXml;
