var _  = require('underscore');




// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

// All functions, include conflict, will be available through _.str object
_.str.include('Underscore.string', 'string'); // => true


var ent = require('ent');


console.log('');
console.log('');
console.log('');

var e = '&#8221;';

console.log(e);
console.log( ent.decode(e) );

console.log('');


var d1 = '<p>While watching the new <a href="http://www.huffingtonpost.com/2012/07/18/beverly-johnson-about-face_n_1682272.html" target="_hplink">HBO documentary &#8220;About Face&#8221; </a>at a screening this week, we were most delighted by Isabella Rossellini&#8217;s on-screen banter. The 60-year-old model and daughter of Ingrid Bergman charmed us with her candid talk about plastic surgery (&#8220;Is it the new foot binding?&#8221;) and about how her life has changed in the industry as she&#8217;s gotten older. (Rossellini famously <a href="http://www.contactmusic.com/news-article/rossellini-still-angry-over-lancome-replacement" target="_hplink">claimed she lost her Lancome contract in 1996</a> for being &#8220;too old.&#8221;)</p>';

console.log('d1: ');
console.log(d1);

console.log('');
var d2 = _(d1).stripTags();

console.log('d2:');
console.log(d2);

console.log('');
var d3 = d2.replace(/,/g, '');//replace all commas with empty string


console.log('d3:');
console.log(d3);

console.log('');
var d4 = d3.replace(/\n/g, ' ');//replace all carriage returns with empty string


console.log('d4:');
console.log(d4);

console.log('');
var d5 = ent.decode(d4);

console.log('d5:');
console.log(d5);


