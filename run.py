"""
This script defines a selection of phosphorjs modules, and uses npm to
install and bundle them in one standalone js file. Needs npm with
browserify and uglify.
"""

import os
import sys
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

package = """
{
  "name": "phosphor-all",
  "version": "1.0.0",
  "description": "Phosphor in one JS file.",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "bundle": "webpack index.js phosphor-all.js"
  },
  "author": "Almar Klein",
  "license": "BSD-3-Clause",
  "repository": "https://github.com/zoofIO/phosphor-all",
  "dependencies": {"phosphor": "latest"},
  "devDependencies": {"webpack": "latest"}
}
""".strip()


## Utils

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
    # Create index.js
    code = 'window.phosphor = {};\n'
    phosphor_dir = op.join(WORK_DIR, 'node_modules', 'phosphor', 'lib')
    for subpackage_name in MODULES:
        code += 'window.phosphor.%s = {};\n' % subpackage_name
        for module_name in os.listdir(op.join(phosphor_dir, subpackage_name)):
            if not module_name.endswith('.js'):
                continue
            module_name = module_name.split('.')[0]
            t = 'window.phosphor.%s.%s = require("phosphor/lib/%s/%s");\n'
            code += t % (subpackage_name, module_name, subpackage_name, module_name)
    return code


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

# Write package spec so npm knows our dependencies
write(op.join(WORK_DIR, 'package.json'), package)

# Install/update dependencies
check_call(['npm', 'install'])

# Write our index file (needs previous step)
write(op.join(WORK_DIR, 'index.js'), create_index())

# Create bundle
check_call(['npm', 'run', 'bundle'])


## Produce dist result

# Get sources
phosphor_js = open(op.join(WORK_DIR, 'phosphor-all.js'), 'rt').read()
phosphor_css = open(op.join(WORK_DIR, 'node_modules/phosphor/styles/base.css'), 'rt').read()
phosphor_license = open(op.join(WORK_DIR, 'node_modules/phosphor/LICENSE'), 'rt').read()

# Process JS asset
js = phosphor_license + minify(phosphor_js, False)
write(op.join(DIST_DIR, 'phosphor-all.js'), js)

# Process CSS asset
css = phosphor_css + open(op.join(THIS_DIR, 'more_phosphor.css'), 'rt').read()
css = css_prefixer(minify(css, False))
css = "/* Phosphor CSS, prefixed for Flexx */\n\n" + phosphor_license + css
write(op.join(DIST_DIR, 'phosphor-all.css'), css)
