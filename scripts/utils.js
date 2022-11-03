/**
 * 自动判断 widget 的 entry 合规性，并自动修正
 * @param {*} config 
 * @param {*} widgetName 
 * @returns 
 */
function replaceEntry(config, widgetName) {
  const entryType = Object.prototype.toString.call(config.entry);
  switch (entryType) {
    case '[object String]':
      config.entry = {
        [widgetName]: config.entry
      };
      break;
    case '[object Object]':
      const entries = Object.entries(config.entry);
      if (entries.length > 0) {
        let [_, mainEntry] = entries[0]; // todo - 只获取第一个么？？？
        config.entry = {
          [widgetName]: mainEntry
        };
        // todo - 不应该支持多 entry ？？
        const len = entries.length;
        for (let i=1; i<len; i++) {
          [_, mainEntry] = entries[i];
          config.entry[`${widgetName}-${i}`] = mainEntry;
        }
      } else {
        console.warn('No correct entry in configuration of webpack!');
      }
      break;
    case '[object Function]':
    case '[object Undefined]':
    case '[object Null]':
    default:
      console.warn(`The entry of webpack config - ${JSON.stringify(config.entry)} may be wrong!`);
      break;
  }
  return config;
}

exports.replaceEntry = replaceEntry;
