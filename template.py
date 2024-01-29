import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import (
    Template,
    PackageType,
    Dependencies,
    RunTimeDeps,
    generate_template,
    Bundles,
    MainModule,
    AuxiliaryModule,
)
from youwol.utils import parse_json

folder_path = Path(__file__).parent

pkg_json = parse_json(folder_path / "package.json")

load_dependencies = {
    "@youwol/rx-vdom": "^1.0.1",
    "rxjs": "^7.5.6",
    "@youwol/webpm-client": "^3.0.1",
}
differed_dependencies = {
    # common for `js-playground`, `py-playground` & `ts-playground` auxiliary modules
    "codemirror": "^5.52.0",
    "@youwol/rx-tree-views": "^0.3.1",
    # `py-playground` auxiliary module
    "@youwol/webpm-pyodide-loader": "^0.2.0",
    # `ts-playground` auxiliary module
    # `typescript` version should match the one from coming from  `@youwol/tsconfig`
    "typescript": "5.3.3",
    "@typescript/vfs": "^1.4.0",
}

template = Template(
    path=folder_path,
    type=PackageType.Library,
    name=pkg_json["name"],
    version=pkg_json["version"],
    shortDescription=pkg_json["description"],
    author=pkg_json["author"],
    dependencies=Dependencies(
        runTime=RunTimeDeps(externals={**load_dependencies, **differed_dependencies}),
        devTime={
            #  those two prevent failure of typedoc
            "@types/codemirror": "^5.52.0",
            "lz-string": "^1.4.4",
            #  this is used only for type declarations
            "grapesjs": "0.20.4",
        },
    ),
    userGuide=True,
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./index.ts", loadDependencies=list(load_dependencies.keys())
        ),
        auxiliaryModules=[
            AuxiliaryModule(
                name="js-playground",
                entryFile="./lib/runner/javascript/js-playground.ts",
                loadDependencies=["@youwol/rx-tree-views", "codemirror"],
            ),
            AuxiliaryModule(
                name="py-playground",
                entryFile="./lib/runner/python/py-playground.ts",
                # Not included here: all the python dependencies that will be fetched w/ component configuration
                loadDependencies=[
                    "@youwol/rx-tree-views",
                    "codemirror",
                    "@youwol/webpm-pyodide-loader",
                ],
            ),
            AuxiliaryModule(
                name="ts-playground",
                entryFile="./lib/runner/typescript/ts-playground.ts",
                # Again `typescript` is coming from `@youwol/tsconfig`
                loadDependencies=[
                    "@youwol/rx-tree-views",
                    "codemirror",
                    "typescript",
                    "@typescript/vfs",
                ],
            ),
        ],
    ),
)

generate_template(template)

shutil.copyfile(
    src=folder_path / ".template" / "src" / "auto-generated.ts",
    dst=folder_path / "src" / "auto-generated.ts",
)

#  webpack.config.ts is not copied here because difference in attributes:
#  *  output
#  *  entry
for file in [
    "README.md",
    ".gitignore",
    ".npmignore",
    ".prettierignore",
    "LICENSE",
    "package.json",
    "webpack.config.ts",
    "tsconfig.json",
]:
    shutil.copyfile(src=folder_path / ".template" / file, dst=folder_path / file)
