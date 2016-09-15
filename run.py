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
        
modules = 'core', 'dom', 'ui', 'collections', 'algorithm'

package = """
{
  "name": "phosphor-all",
  "version": "1.0.0",
  "description": "Phosphor in one JS file.",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "Almar Klein",
  "license": "BSD-3-Clause",
  "repository": "https://github.com/zoofIO/phosphor-all",
  "dependencies": {"phosphor": "latest"}
}
""".strip()

# todo: make a createPanel function

CODE = """
window.phosphor.createWidget = function (name) {
    var ori = phosphor.ui.widget.Widget.createNode;
    phosphor.ui.widget.Widget.createNode = function() {
        return document.createElement(name);
    };
    var w = new phosphor.ui.widget.Widget();
    phosphor.ui.widget.Widget.createNode = ori;
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
open('package.json', 'wt').write(package)

# Install
check_call(['npm', 'install'])

# Create index.js
code = 'window.phosphor = {};\n'
phosphor_dir = os.path.join(THIS_DIR, 'node_modules', 'phosphor', 'lib')
for subpackage_name in modules:
    code += 'window.phosphor.%s = {};\n' %  subpackage_name
    for module_name in os.listdir(os.path.join(phosphor_dir, subpackage_name)):
        if not module_name.endswith('.js'):
            continue
        module_name = module_name.split('.')[0]
        t = 'window.phosphor.%s.%s = require("phosphor/lib/%s/%s");\n'
        code += t % (subpackage_name, module_name, subpackage_name, module_name)

code += CODE
open('index.js', 'wt').write(code)

# Create bundle
check_call(['npm', 'install', 'browserify', 'browserify-css', 'uglify'])
check_call(['browserify', '-g', '[', 'browserify-css', '--minify=true', ']', 
            'index.js', '-o', 'phosphor-all.js'])

# Uglify breaks if its run from any other drive than C:
# I only got it from 290 to 210 so I decided not to go through the trouble
#check_call(['uglify', '-o', 'phosphor-all.min.js', 'phosphor-all.js'])

# Strip comments in non-minified, and add license text once
text = open('phosphor-all.js', 'rt').read()
text = minify(text, False)
text = LICENSE + text
open('phosphor-all.js', 'wt').write(text)
