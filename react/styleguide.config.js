const path = require('path');
const { version } = require('./package');

module.exports = {
    components: [
        'src/components/Banner/index.js',
        'src/components/Buttons/**/[A-Z]*.js',
        'src/components/Checkbox/**/[A-Z]*.js',
        'src/components/ColorPicker/**/[A-Z]*.js',
        'src/components/Modal/**/[M]*.js',
        'src/components/MultiToggleSwitch/index.js',
        'src/components/RadioButton/**/[A-Z]*.js',
        'src/components/SliderToggle/**/[A-Z]*.js'
    ],
    styles: {
        StyleGuide: {
            '@global body': {
                fontFamily: '"Roboto", sans-serif'
            }
        }
    },
    styleguideComponents: {
        Wrapper: path.join(__dirname, 'src/styleguide/ThemeWrapper')
    },
    defaultExample: false,
    usageMode: "expand",
    version: "1.1.0",
    template: {
        favicon: 'public/favicon.ico',
        head: {
            links: [
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900'
                }
            ]
        }
    },
    theme: {
        fontFamily: {
          base: '"Roboto", sans-serif'
        },
        sidebarWidth: 300
    },
    require: [
        path.join(__dirname, 'src/styleguide/styleguide.css')
    ],
	webpackConfig: {
		module: {
			rules: [
				{
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            {
                                plugins: [
                                    '@babel/plugin-proposal-class-properties'
                                ]
                            }
                        ]
                    },
                },
				{
					test: /\.css$/,
					loader: 'style-loader!css-loader',
                },
                {
                    test: /\.(jpe?g|png|gif|svg|woff(2)?|ttf|eot)$/i,
                    loader: "file-loader?name=[name].[ext]&outputPath=icons/"
                }
			],
		},
    },
    serverPort: 9988
};