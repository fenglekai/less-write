const getItemsFromNode = (node) => {
  // handle non-array values as an array of length 1
  // return 'undefined' if index is invalid
  const items = Array.isArray(node.value) ? node.value : Array(node);

  return items;
};

module.exports = {
  install: function (less, pluginManager, functions) {
    functions.add("join", function (list, separator = { value: "" }) {
      if (!list) {
        throw Error("list does not exist");
      }
      const iterator = getItemsFromNode(list);
      let join = "";
      for (let i = 0; i < iterator.length; i++) {
        if (i !== iterator.length - 1) {
          join += iterator[i].value + separator.value;
        } else {
          join += iterator[i].value;
        }
      }
      return join;
    });
    functions.add("splice", function () {
      let splice = "";
      for (let i = 0; i < arguments.length; i++) {
        const iterator = getItemsFromNode(arguments[i])[0].value;
        splice += iterator;
      }
      return splice;
    });
  },
};
