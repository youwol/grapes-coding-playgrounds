from youwol.app.environment import YouwolEnvironment
from youwol.app.environment.models_project import JsBundle, IPipelineFactory
from youwol.pipelines.pipeline_typescript_weback_npm import pipeline, PipelineConfig
from youwol.utils.context import Context


class PipelineFactory(IPipelineFactory):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    async def get(self, env: YouwolEnvironment, context: Context):
        config = PipelineConfig(
            target=JsBundle(), with_tags=["grapesjs", "grapesjs-plugin"]
        )
        return await pipeline(config, context)
