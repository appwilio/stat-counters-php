var DEFAULT_LANGS = ['ru', 'en'],
    fs = require('fs'),
    path = require('path'),
    levels = require('enb-bem-techs/techs/levels'),
    levelsToBemdecl = require('enb-bem-techs/techs/levels-to-bemdecl'),
    provide = require('enb/techs/file-provider'),
    PLATFORMS = {
	'common' : ['common']
    };

module.exports = function(config) {
    var platforms = ['common'];

    config.includeConfig('enb-bem-tmpl-specs');

    configureSets(platforms, {
	tmplSpecs : config.module('enb-bem-tmpl-specs').createConfigurator('tmpl-specs')
    });

    function configureLevels(platform, nodes) {
	config.nodes(nodes, function(nodeConfig) {
	    var nodeDir = nodeConfig.getNodePath(),
		blockSublevelDir = path.join(nodeDir, '..', '.blocks'),
		sublevelDir = path.join(nodeDir, 'blocks'),
		extendedLevels = [].concat(getLevels(platform));

	    if(fs.existsSync(blockSublevelDir)) {
		extendedLevels.push(blockSublevelDir);
	    }

	    if(fs.existsSync(sublevelDir)) {
		extendedLevels.push(sublevelDir);
	    }

	    nodeConfig.addTech([levels, {
		levels : extendedLevels
	    }]);
	});
    }

    function configureSets(platforms, sets) {
	platforms.forEach(function(platform) {
	    sets.tmplSpecs.configure({
		destPath : platform + '.tmpl-specs',
		levels : getSpecLevels(platform),
		sourceLevels : getLevels(platform),
		engines : {
		    bh : {
			tech : 'enb-bh/techs/bh-server',
			options : {
			    jsAttrName : 'data-bem',
			    jsAttrScheme : 'json'
			}
		    },
		    'bemhtml-dev' : {
			tech : 'enb-bemxjst/techs/bemhtml-old',
			options : { devMode : true }
		    },
		    'bemhtml-prod' : {
			tech : 'enb-bemxjst/techs/bemhtml-old',
			options : { devMode : false }
		    }
		}
	    });
	});
    }
};

function getLevels(platform) {
    var levels = [];

    PLATFORMS[platform].forEach(function(name) {
	levels.push({
	    path : path.join('libs', 'bem-core', name + '.blocks'),
	    check : false
	});
    });

    PLATFORMS[platform].forEach(function(name) {
	levels.push(name + '.blocks');
    });

    return levels;
}

function getSpecLevels(platform) {
    var levels = [];

    PLATFORMS[platform].forEach(function(name) {
	levels.push(name + '.blocks');
    });

    return levels;
}
