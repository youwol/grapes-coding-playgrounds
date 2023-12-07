import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template, Bundles, MainModule
from youwol.utils import parse_json

folder_path = Path(__file__).parent

pkg_json = parse_json(folder_path / 'package.json')

load_dependencies = {
    '@youwol/rx-vdom': "^1.0.1",
    'rxjs': "^7.5.6",
    '@youwol/webpm-client': "^3.0.1"
}
differed_dependencies = {
    "@typescript/vfs": "^1.4.0",
    "codemirror": "^5.52.0",
    "@youwol/rx-tree-views": "^0.3.1",
}

template = Template(
    path=folder_path,
    type=PackageType.Library,
    name=pkg_json['name'],
    version=pkg_json['version'],
    shortDescription=pkg_json['description'],
    author=pkg_json['author'],
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            externals={
                **load_dependencies,
                **differed_dependencies
            }
        ),
        devTime={
            #  those two prevent failure of typedoc
            "@types/codemirror": "^5.52.0",
            "@types/lz-string": "^1.3.34",
            "lz-string": "^1.4.4",
            #  this is used only for type declarations
            'grapesjs': "0.20.4"
        }
    ),
    userGuide=True,
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./index.ts",
            loadDependencies=list(load_dependencies.keys())
        )
    )
)

generate_template(template)

shutil.copyfile(
    src=folder_path / '.template' / 'src' / 'auto-generated.ts',
    dst=folder_path / 'src' / 'auto-generated.ts'
)

#  webpack.config.ts is not copied here because difference in attributes:
#  *  output
#  *  entry
for file in ['README.md', '.gitignore', '.npmignore', '.prettierignore', 'LICENSE', 'package.json',
             'tsconfig.json']:
    shutil.copyfile(
        src=folder_path / '.template' / file,
        dst=folder_path / file
    )
