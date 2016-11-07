"""
This script defines a selection of phosphorjs modules, and uses npm to
install and bundle them in one standalone js file. Needs npm with
browserify and uglify.
"""

import subprocess
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
    code += 'window.phosphor.%s = {};\n' % subpackage_name
    for module_name in os.listdir(os.path.join(phosphor_dir, subpackage_name)):
        if not module_name.endswith('.js'):
            continue
        module_name = module_name.split('.')[0]
        t = 'window.phosphor.%s.%s = require("phosphor/lib/%s/%s");\n'
        code += t % (subpackage_name, module_name, subpackage_name, module_name)

open('index.js', 'wt').write(code)

# Create bundle
check_call(['npm', 'run', 'bundle'])

# Uglify breaks if its run from any other drive than C:
# I only got it from 290 to 210 so I decided not to go through the trouble
#check_call(['uglify', '-o', 'phosphor-all.min.js', 'phosphor-all.js'])

# Perform our own lightweight minification, and add license text once
text = open('phosphor-all.js', 'rt').read()
text = minify(text, False)
text = LICENSE + text
open('phosphor-all.js', 'wt').write(text)


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
                    line = '.flx-Widget ' + line
                else:
                    raise ValueError('Cannot yet parse multiple selectors per line.')
        lines.append(line)
    return '\n'.join(lines)
    
# Copy minified and licence-added version of Phosphor's base.css
text = open('node_modules/phosphor/styles/base.css', 'rt').read()
text += open('more_phosphor.css', 'rt').read()
text = css_prefixer(minify(text, False))
text = "/* Phosphor CSS, prefixed for Flexx */\n\n" + LICENSE + text
open('phosphor-all.css', 'wt').write(text)
