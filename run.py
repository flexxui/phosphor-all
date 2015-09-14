import subprocess
import json
import os


THIS_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(THIS_DIR)

modules = 'boxpanel', 'splitpanel', 'tabs', 'dockpanel'

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


# Write package.json
deps_dict = dict([('phosphor-' + m, 'latest') for m in modules])
package = package.replace('DEPS', json.dumps(deps_dict, indent=4))
open('package.json', 'wt').write(package)

# Install
subprocess.check_call(['npm', 'install'], cwd=THIS_DIR)

# Create index.js
code = ''
# for m in modules:
    # code += 'var %s = require("phosphor-%s");\n' % (m, m)
code += 'window.phosphor = {};\n'
for m in modules:
    code += 'window.phosphor.%s = require("phosphor-%s");\n' % (m, m)
open('index.js', 'wt').write(code)

# Create bundle
subprocess.check_call(['npm', 'install', 'browserify', 'browserify-css', 'uglify'], cwd=THIS_DIR)
subprocess.check_call(['browserify', '-g', '[', 'browserify-css', '--minify=true', ']', 'index.js', '-o', 'phosphor.js'], cwd=THIS_DIR)
subprocess.check_call(['uglify', '-s', 'phosphor.js', '-o', 'phosphor.min.js'], cwd=THIS_DIR)
