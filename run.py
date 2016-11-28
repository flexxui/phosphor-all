"""
This script defines a selection of phosphorjs modules, and uses npm and
webpack to install and bundle them in one standalone js file.
"""

import os
import sys
import json
import subprocess
import os.path as op

from flexx.util.minify import minify


## Prepare

THIS_DIR = op.dirname(op.abspath(__file__))
WORK_DIR = op.join(THIS_DIR, 'build')
DIST_DIR = op.join(THIS_DIR, 'dist')

for d in (WORK_DIR, DIST_DIR):
    if not op.isdir(d):
        os.mkdir(d)

MODULES = 'core', 'dom', 'ui', 'collections', 'algorithm'

PACKAGE = """
{
  "name": "phosphor-all",
  "version": "1.1.0",
  "description": "Phosphor in one JS file.",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "bundle": "webpack index.js phosphor-all.js"
  },
  "author": "Almar Klein",
  "license": "BSD-2-Clause",
  "repository": "https://github.com/zoofIO/phosphor-all",
  "dependencies": {"phosphor": "latest"},
  "devDependencies": {"webpack": "latest"}
}
""".strip()

INDEX = """
var phosphor_version = "PHOSPHOR_VERSION";  // easy to find line that defines version
function require_phosphor (path) {
    // Normalize input
    if (path.endsWith('.js')) { path = path.slice(0, -3); }
    if (path.startsWith('/')) { path = path.slice(1); }
    if (path.startsWith('phosphor/')) { path = path.slice(9); }
    // Return module or throw error
    var mod = modules[path];
    if (typeof mod === 'undefined') {
        throw "Phosphor lib '" + path + "' is not present in Phosphor-all bundle.";
    }
    return mod;
}
require_phosphor.phosphor_version = phosphor_version;
window.require_phosphor = require_phosphor;

var modules = {};
MAPPINGS
"""


## Utils

def read(filename):
    with open(filename, 'rt') as file:
        return file.read()

def write(filename, text):
    with open(filename, 'wt') as file:
        file.write(text)
    print('wrote', filename)


def check_call(cmd, **kwargs):
    kwargs['cwd'] = WORK_DIR
    if sys.platform.startswith('win'):
        kwargs['shell'] = True
    return subprocess.check_call(cmd, **kwargs)


def create_index():
    code = INDEX
    # Set version
    fname = op.join(WORK_DIR, 'node_modules', 'phosphor', 'package.json')
    code = code.replace('PHOSPHOR_VERSION', json.load(open(fname))['version'])
    # Get mappings
    mappings = []
    phosphor_dir = op.join(WORK_DIR, 'node_modules', 'phosphor', 'lib')
    for subpackage_name in MODULES:
        for module_name in os.listdir(op.join(phosphor_dir, subpackage_name)):
            if not module_name.endswith('.js'):
                continue
            path = subpackage_name + '/' + module_name.split('.')[0]
            t = 'modules["lib/%s"] = require("phosphor/lib/%s");'
            mappings.append(t % (path, path))
    return code.replace('MAPPINGS', '\n'.join(mappings))


def css_prefixer(text):
    """ Prefix Phosphor CSS with .flx-Widget so it does not interfere
    with other Phosphor JS on the page.
    """
    lines = []
    for line in text.splitlines():
        if '.p-' in line:
            p_selectors = [p.strip() for p in line.strip(' {').split(',')]
            p_selectors = [p for p in p_selectors if p.startswith('.p-')]
            if p_selectors:
                if line.startswith('.p-') and len(p_selectors) == 1:
                    if p_selectors[0] == '.p-Widget':
                        line = line.replace('.p-Widget', '.flx-Widget')
                    else:
                        line = '.flx-Widget ' + line
                else:
                    raise ValueError('Cannot yet parse multiple selectors per line.')
        lines.append(line)
    return '\n'.join(lines)


## Run npm

if True:  # Turn this off to easily tweak result without rebuilding
    
    # Write package spec so npm knows our dependencies
    write(op.join(WORK_DIR, 'package.json'), PACKAGE)
    
    # Install/update dependencies
    check_call(['npm', 'install'])
    
    # Write our index file (needs previous step)
    write(op.join(WORK_DIR, 'index.js'), create_index())
    
    # Create bundle
    check_call(['npm', 'run', 'bundle'])


## Produce dist result

# Get sources
phosphor_js = read(op.join(WORK_DIR, 'phosphor-all.js'))
phosphor_css = read(op.join(WORK_DIR, 'node_modules/phosphor/styles/base.css'))
phosphor_license = read(op.join(WORK_DIR, 'node_modules/phosphor/LICENSE'))
phosphor_license = '/*\n%s\n*/\n' % phosphor_license.strip()

# Process JS asset
js = phosphor_license + minify(phosphor_js, False)
write(op.join(DIST_DIR, 'phosphor-all.js'), js)

# Process CSS asset
css = phosphor_css + read(op.join(THIS_DIR, 'more_phosphor.css'))
css = css_prefixer(minify(css, False))
css = "/* Phosphor CSS, prefixed for Flexx */\n\n" + phosphor_license + css
write(op.join(DIST_DIR, 'phosphor-all.css'), css)
