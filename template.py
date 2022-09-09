from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import Template, PackageType, Dependencies, \
    RunTimeDeps, generate_template

template = Template(
    path=Path(__file__).parent,
    type=PackageType.Library,
    name="@youwol/grapes-coding-playgrounds",
    version="0.0.3-wip",
    shortDescription="Various components for grapes for live coding in different languages.",
    author="greinisch@youwol.com",
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            load={
                '@youwol/flux-view': "^0.1.1",
                'rxjs': "^6.5.5",
                '@youwol/cdn-client': "^0.1.4",
            },
            differed={
                'grapesjs': "0.18.3",  # this is actually not used (only for type declarations)
                'typescript': "^4.7.4",
                "@typescript/vfs": "^1.3.5",
                "codemirror": "^5.52.0",
                "@youwol/fv-tree": "^0.1.4",
            },
            includedInBundle=["@typescript/vfs"]
        ),
        devTime={
        }
    ),
    userGuide=True
    )

generate_template(template)
