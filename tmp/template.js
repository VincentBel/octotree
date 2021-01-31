const TEMPLATE = '<div>\n' +
    '  <nav class="octotree-sidebar">\n' +
    '    <div class="octotree-toggle">\n' +
    '      <i class="octotree-toggle-icon" role="button"></i> <span>Octotree</span>\n' +
    '\n' +
    '      <div class="popup">\n' +
    '        <div class="arrow"></div>\n' +
    '        <div class="content">\n' +
    '          Hi there, this is Octotree. Move mouse over this button to display the code tree. You can also press the\n' +
    '          shortkey <kbd>cmd shift s</kbd> (or <kbd>ctrl shift s</kbd>).\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="octotree-main-icons">\n' +
    '      <a class="octotree-pin" data-store="PINNED">\n' +
    '        <span class="tooltipped tooltipped-s" aria-label="Pin this sidebar"> <i class="octotree-icon-pin"></i> </span>\n' +
    '      </a>\n' +
    '\n' +
    '      <a class="octotree-settings">\n' +
    '        <span class="tooltipped tooltipped-s" aria-label="Settings"> <i class="octotree-icon-settings"></i> </span>\n' +
    '      </a>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="octotree-views">\n' +
    '      <div class="octotree-view octotree-tree-view current">\n' +
    '        <div class="octotree-view-header"></div>\n' +
    '        <div class="octotree-view-body"></div>\n' +
    '        <a class="octotree-spin"> <span class="octotree-spin--loader"></span> </a>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="octotree-view octotree-error-view">\n' +
    '        <div class="octotree-view-header octotree-header-text-top"></div>\n' +
    '        <form class="octotree-view-body"><div class="message"></div></form>\n' +
    '      </div>\n' +
    '\n' +
    '      <div class="octotree-view octotree-settings-view">\n' +
    '        <div class="octotree-view-header octotree-header-text-top">Settings</div>\n' +
    '        <form class="octotree-view-body">\n' +
    '          <div>\n' +
    '            <label>GitHub access token</label>\n' +
    '            <div class="octotree-token-actions">\n' +
    '              <a class="octotree-create-token" target="_blank" tabindex="-1"\n' +
    '                ><!--\n' +
    '                --><span class="tooltipped tooltipped-n" aria-label="Generate new token"\n' +
    '                  ><i class="octotree-icon-key"></i></span\n' +
    '                ><!--\n' +
    '              --></a>\n' +
    '              <a\n' +
    '                class="octotree-help"\n' +
    '                href="https://github.com/ovity/octotree#access-token"\n' +
    '                target="_blank"\n' +
    '                tabindex="-1"\n' +
    '              >\n' +
    '                <span class="tooltipped tooltipped-n" aria-label="Learn more">\n' +
    '                  <i class="octotree-icon-help"></i>\n' +
    '                </span>\n' +
    '              </a>\n' +
    '            </div>\n' +
    '            <input type="text" class="form-control input-block" data-store="TOKEN" />\n' +
    '            <div class="octotree-disclaimer text-gray">Token is stored in local storage</div>\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <div>\n' +
    '              <label>Hotkeys</label>\n' +
    '              <div class="octotree-token-actions">\n' +
    '                <a class="octotree-help" href="https://github.com/ovity/octotree#hotkeys" target="_blank" tabindex="-1">\n' +
    '                  <span class="tooltipped tooltipped-n" aria-label="Learn more">\n' +
    '                    <i class="octotree-icon-help"></i>\n' +
    '                  </span>\n' +
    '                </a>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '            <input\n' +
    '              type="text"\n' +
    '              autocomplete="off"\n' +
    '              spellcheck="false"\n' +
    '              autocapitalize="off"\n' +
    '              class="form-control"\n' +
    '              data-store="HOTKEYS"\n' +
    '            />\n' +
    '          </div>\n' +
    '\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="HOVEROPEN" /> <span>Show sidebar on hover</span></label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="ICONS" /> <span>Show file-type icons</span></label>\n' +
    '          </div>\n' +
    '          <div>\n' +
    '            <label><input type="checkbox" data-store="LAZYLOAD" /> <span>Lazy-load code tree</span></label>\n' +
    '            <span class="octotree-disclaimer is-margin-left text-gray">Speed up large repositories</span>\n' +
    '          </div>\n' +
    '\n' +
    '          <div><button class="btn btn-primary">Apply settings</button></div>\n' +
    '        </form>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="octotree-footer"></div>\n' +
    '  </nav>\n' +
    '</div>\n' +
    ''