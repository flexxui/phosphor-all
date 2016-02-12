"""
This script defines a selection of phosphorjs modules, and uses npm to
install and bundle them in one standalone js file. Needs npm with
browserify and uglify.
"""

import subprocess
import json
import sys
import os

from flexx.util.minify import minify

THIS_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(THIS_DIR)

modules = ['disposable', 'messaging', 'properties', 'signaling',
           'boxengine', 'domutil', 'nodewrapper',
           'widget', 'panel', 'menus',
           'boxpanel', 'gridpanel', 'splitpanel', 'stackedpanel', 'tabs', 'dockpanel',
           ]

package = """
{
  "name": "phosphor-all",
  "version": "0.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "Almar Klein",
  "license": "BSD",
  "dependencies": DEPS
}
""".strip()

# todo: make a createPanel function

CODE = """
window.phosphor.createWidget = function (name) {
    var ori = phosphor.widget.Widget.createNode;
    phosphor.widget.Widget.createNode = function() {
        return document.createElement(name);
    };
    var w = new phosphor.widget.Widget();
    phosphor.widget.Widget.createNode = ori;
    return w;
};
"""

LICENSE = '/*\n%s\n*/\n' % open('phosphor_license.txt', 'rb').read().decode().strip()


def check_call(cmd, **kwargs):
    kwargs['cwd'] = THIS_DIR
    if sys.platform.startswith('win'):
        kwargs['shell'] = True
    return subprocess.check_call(cmd, **kwargs)

# Write package.json
deps_dict = dict([('phosphor-' + m, 'latest') for m in modules])
package = package.replace('DEPS', json.dumps(deps_dict, indent=4))
open('package.json', 'wt').write(package)

# Install
check_call(['npm', 'install'])

# Create index.js
code = ''
# for m in modules:
#     code += 'var %s = require("phosphor-%s");\n' % (m, m)
code += 'window.phosphor = {};\n'
for m in modules:
    code += 'window.phosphor.%s = require("phosphor-%s");\n' % (m, m)
code += CODE
open('index.js', 'wt').write(code)

# Create bundle
check_call(['npm', 'install', 'browserify', 'browserify-css', 'uglify'])
check_call(['browserify', '-g', '[', 'browserify-css', '--minify=true', ']', 
            'index.js', '-o', 'phosphor-all.js'])
# check_call(['uglify', '-s', 'phosphor-all.js', '-o', 'phosphor-all.min.js'])
# todo: uglify is broken on windows?

# Strip comments in non-minified, and add license text once
text = open('phosphor-all.js', 'rt').read()
text = minify(text, False)
text = LICENSE + text
open('phosphor-all.js', 'wt').write(text)
