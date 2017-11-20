var MockJS = require( 'mockjs' );
var MockRandom = MockJS.Random;
var CDN_PICS = require( '../lib/json-schema-mock/MOCK_DATA/cdn_pics' );

function randomEnum(enums){
  return enums[Math.floor(Math.random(10) * enums.length)]
}
 
const bools = [true, false];

const formatMock = {
  float(enums) {
    if(enums){
      return randomEnum(enums);
    }else{
      return MockRandom.float(0, 99999);
    }
  },
  date(enums) {
    if(enums){
      return randomEnum(enums);
    }else{
      return MockRandom.date();
    }
  },
  PHONE(enums) {
    if(enums){
      return randomEnum(enums);
    }else{
      const arr = [1];
      for(let i = 10; i--;){
        arr.push(Random.integer(0, 9));
      }
      return Number(arr.join(''));
    }
  },
  TELE_PHONE(enums) {
    if(enums){
      return randomEnum(enums);
    }else{
      const arr = [1];
      for(let i = 3; i--;){
        arr.push(Random.integer(0, 9));
      }
      arr.push('-');
      for(let i = 7; i--;){
        arr.push(Random.integer(0, 9));
      }
      return arr.join('');
    }
  },
  PIC(enums) {
    if(enums){
      return randomEnum(enums);
    }else{
      return CDN_PICS[ MockRandom.integer( 0, CDN_PICS.length -1 ) ];
    }
  },
  HEX(enums) {
    if(enums){
      return randomEnum(enums);
    }else{
      return Random.hex()
    }
  },
  ARRAY(enums) {
    const arr = [];
    for(let i = Random.integer(0, 9); i--;){
      if(enums){
        arr.push(randomEnum(enums));
      }else{
        arr.push(Random.integer(0, 9));
      }
    }
    return arr.join(',');
  }
};


export function FormatMocker(format, schema){
  const [prefix, type] = format.split('/');
  if(formatMock[type]){
    return formatMock[type](schema.enum);
  }
};
