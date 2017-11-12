const context = require.context('.', true, /\w+\/index\.jsx$/);
const Layotus = {};

context.keys().forEach(key => {
  const name = key.split('/').slice(-2)[0];
  Layotus[name] = context(key);
});

const Layer = {
  defaultLayout: 'consoleLayout',
  getLayout(type){
    return Layotus[type] || Layotus[Layer.defaultLayout]
  }
}

export default Layer;
