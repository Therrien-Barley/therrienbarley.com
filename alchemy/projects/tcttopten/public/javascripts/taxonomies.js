define([],
function() {

	var TAXONOMIES = {
		categories: [
			'philosophy',
		    'material',
		    'light',
		    'architecture',
		    'fashion',
		    'tech',
		    'design',
		    'women'
		],
	
		terms: [
			'art',
			'magazine',
		    '3d printing',
		    'crowdsourcing',
		    'patterns',
		    'collaboration',
		    '4d printing',
		    'youth',
		    'aging',
		    '1990s',
		    'transgenerational',
		    'quantified self',
		    'context awareness',
		    'ubiquitous computing',
		    'realtime',
		    'social media',
		    'peer to peer',
		    'prosumer',
		    'ownership',
		    'identity',
		    'big data',
		    'analytics',
		    'cultural memory',
		    'nostalgia',
		    'emotion',
		    'new americana',
		    'authenticity',
		    'new aesthetic',
		    'digital dualism',
		    'augmented reality',
		    'maker culture',
		    'street culture',
		    'network culture',
		    'filter failure',
		    'content production',
		    'storytelling',
		    'communication',
		    'advertising',
		    'gamification',
		    'behavior',
		    'collaborative consumption',
		    'share economy',
		    'semantic web',
		    'anticipatory computing',
		    'indieweb',
		    'hypermaterial',
		    'reflectivity',
		    'material lifespan',
		    'wood',
		    'glass',
		    'invisible design',
		    'wearables',
		    'embedded devices',
		    'motivational objects',
		    'performance',
		    'sportswear',
		    'byod',
		    'alternative energy',
		    'mobile workforce',
		    'object oriented ontology',
		    'androgeny',
		    'feminism',
		    'women in tech',
		    'celebrity',
		    'gender roles',
		    'thought leader',
		    'hardware',
		    'socialtech',
		    '1990s',
		    'interface',
		    'sharing',
		    'cultures',
		    'opensource',
		    'postdigital'
		],

		// used to check if word is a category term
		// returns the first term that is a category
		isCategory: function(word){
			console.log('');console.log('');
			console.log('this.categories');
			console.dir(this.categories);
			console.log('');
			console.log('');
			if(typeof(word) == "string"){
				for(var c = 0; c < this.categories.length; c++){
					if( word.toLowerCase() == this.categories[c].toLowerCase() ){
						console.log('found category!: '+ word);
						return word;
					}
				}
			}else{
				for(var w = 0; w < word.length; w++){
					for(var c = 0; c < this.categories.length; c++){
						if( word[w].toLowerCase() == this.categories[c].toLowerCase() ){
							console.log('found category!: '+ word[w]);
							return word[w];
						}
					}
				}
			}
			console.log('no category returning null');
			return null;
		}//end isCategory
	};

	return TAXONOMIES;

});