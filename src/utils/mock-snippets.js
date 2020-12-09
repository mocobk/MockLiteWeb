//https://cloud9-sdk.readme.io/docs/snippets
// 相同补全单词，越靠后使用时排列越靠前，如使用时： @county() 排列在 @county( prefix ) 前
const snippetText = `
snippet @region()
	region()

snippet @province()
	province()

snippet @city( prefix )
	city(\${1:true})

snippet @city()
	city()

snippet @county( prefix )
	county(\${1:true})

snippet @county()
	county()

snippet @zip()
	zip()

snippet @boolean( min, max, current )
	boolean(\${1:1}, \${2:9}, \${3:true})

snippet @boolean()
	boolean()

snippet @bool( min, max, current )
	bool(\${1:1}, \${2:9}, \${3:false})

snippet @bool()
	bool()

snippet @natural( min, max )
	natural(\${1:60}, \${2:100})

snippet @natural( min )
	natural(\${1:10000})

snippet @natural()
	natural()

snippet @integer( min, max )
	integer(\${1:60}, \${2:100})

snippet @integer( min )
	integer(\${1:10000})

snippet @integer()
	integer()

snippet @float( min, max, dmin, dmax )
	float(\${1:60}, \${2:100}, \${3:3}, \${4:5})

snippet @float( min, max, dmin )
	float(\${1:60}, \${2:100}, \${3:3})

snippet @float( min, max )
	float(\${1:60}, \${2:100})

snippet @float( min )
	float(\${1:0})

snippet @float()
	float()

snippet @character( pool | 'lower' | 'upper' | 'number' | 'symbol')
	character('\${1:lower}')

snippet @character()
	character()

snippet @string( pool, min, max )
	string('\${1:aeiou}', \${2:3})

snippet @string( pool, length )
	string('\${1:lower}', \${2:5})

snippet @string( min, max )
	string(\${1:7}, \${2:0})

snippet @string( length )
	string(\${1:5})

snippet @string()
	string()

snippet @range( start, stop, step )
	range(\${1:1}, \${2:2})

snippet @range( start, stop )
	range(\${1:3}, \${2:7})

snippet @range( stop )
	range(\${1:10})

snippet @color()
	color()

snippet @hex()
	hex()

snippet @rgb()
	rgb()

snippet @rgba()
	rgba()

snippet @hsl()
	hsl()

snippet @date(format)
	date('\${1:yyyy-MM-dd}')

snippet @date()
	date()

snippet @time( format )
	time('\${1:HH:mm:ss}')

snippet @time()
	time()

snippet @datetime( format )
	datetime('\${1:yyyy-MM-dd HH:mm:ss}')

snippet @datetime()
	datetime()

snippet @timestamp()
	timestamp()

snippet @now( unit, format )
	now('\${1:day}', '\${1:yyyy-MM-dd HH:mm:ss SS}')

snippet @now( format )
	now('\${1:yyyy-MM-dd HH:mm:ss SS}')

snippet @now( unit )
	now('\${1:year}')

snippet @now()
	now()

snippet @capitalize( word )
	capitalize('\${1:hello}')

snippet @upper( str )
	upper('\${1:hello}')

snippet @lower( str )
	lower('\${1:HELLO}')

snippet @pick( array )
	pick(\${1:['a', 'e', 'i', 'o', 'u']})

snippet @shuffle( array, min, max )
	shuffle(\${1:['a', 'e', 'i', 'o', 'u']}, \${2:2}, \${3:4})

snippet @shuffle( array, length )
	shuffle(\${1:['a', 'e', 'i', 'o', 'u']}, \${2:3})

snippet @shuffle( array )
	shuffle(\${1:['a', 'e', 'i', 'o', 'u']})

snippet @image( size, background, foreground, format, text )
	image('\${1:300x400}', '\${2:#234567}', '\${3:#FFFFFF}', '\${4:png}', '\${5:文字}')

snippet @image( size, background, foreground, text )
	image('\${1:300x400}', '\${2:#234567}', '\${3:#FFFFFF}', '\${4:文字}')

snippet @image( size, background, text )
	image('\${1:300x400}', '\${2:#234567}', '\${3:文字}')

snippet @image( size, text )
	image('\${1:300x400}', '\${2:文字}')

snippet @image( size )
	image('\${1:300x400}')

snippet @image()
	image()

snippet @guid()
	guid()

snippet @id()
	id()

snippet @version(depth)
	version(\${1:4})

snippet @version()
	version()

snippet @increment( step )
	increment(\${1:100})

snippet @increment()
	increment()

snippet @phone()
	phone()

snippet @first()
	first()

snippet @last()
	last()

snippet @name( middle )
	name(\${1:true})

snippet @name()
	name()

snippet @cfirst()
	cfirst()

snippet @clast()
	clast()

snippet @cname()
	cname()

snippet @paragraph( min, max )
	paragraph(\${1:1}, \${2:3})

snippet @paragraph( len )
	paragraph(\${1:2})

snippet @paragraph()
	paragraph()

snippet @cparagraph( min, max )
	cparagraph(\${1:1}, \${2:3})

snippet @cparagraph( len )
	cparagraph(\${1:2})

snippet @cparagraph()
	cparagraph()

snippet @sentence( min, max )
	sentence(\${1:3}, \${2:5})

snippet @sentence( len )
	sentence(\${1:5})

snippet @sentence()
	sentence()

snippet @csentence( min, max )
	csentence(\${1:1}, \${2:3})

snippet @csentence( len )
	csentence(\${1:2})

snippet @csentence()
	csentence()

snippet @word( min, max )
	word(\${1:3}, \${2:5})

snippet @word( len )
	word(\${1:5})

snippet @word()
	word()

snippet @cword( pool, min, max )
	cword('\${1:零一二三四五}', \${2:2}, \${3:4})

snippet @cword( pool, length )
	cword('\${1:零一二三四五}', \${2:3})

snippet @cword( min, max )
	cword(\${1:5}, \${2:7})

snippet @cword( pool )
	cword('\${1:零一二三四五六七八九十}')

snippet @cword( length )
	cword(\${1:3})

snippet @cword()
	cword()

snippet @emoji( pool, min, max )
	emoji('\${1:123🌘😷🙊★♠♫}', \${2:3}, \${3:6})

snippet @emoji( pool, length )
	emoji('\${1:😀😁😂😃😄}', \${2:2})

snippet @emoji( min, max )
	emoji(\${1:3}, \${2:6})

snippet @emoji( pool )
	emoji('\${1:😀😁😂😃😄}')

snippet @emoji( length )
	emoji(\${1:3})

snippet @emoji()
	emoji()

snippet @title( min, max )
	title(\${1:3}, \${2:5})

snippet @title( len )
	title(\${1:5})

snippet @title()
	title()

snippet @ctitle( min, max )
	ctitle(\${1:3}, \${2:5})

snippet @ctitle( len )
	ctitle(\${1:5})

snippet @ctitle()
	ctitle()

snippet @url( protocol, host )
	url('\${1:https}', '\${2:mock-lite.com}')

snippet @url( protocol )
	url('\${1:https}')

snippet @url()
	url()

snippet @protocol()
	protocol()

snippet @domain()
	domain()

snippet @tld()
	tld()

snippet @email( domain )
	email('\${1:mock-lite.com}')

snippet @email()
	email()

snippet @ip()
	ip()
`;


ace.define("ace/snippets/json",["require","exports","module"],function(e,t,n){"use strict";t.snippetText=snippetText,t.scope="json"})
