using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SibIntek.Startup))]
namespace SibIntek
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
