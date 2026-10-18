const fs = require('fs');

const file = 'apps/web/src/app/admin/invitations/page.tsx';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('QuickCreateModal')) {
  code = code.replace(
    "import Link from 'next/link';",
    "import Link from 'next/link';\nimport QuickCreateModal from './QuickCreateModal';"
  );
  
  // Replace the header
  code = code.replace(
    '<h1 className="text-3xl font-bold">Invitations</h1>',
    `<h1 className="text-2xl sm:text-3xl font-bold">Invitations</h1>
        <QuickCreateModal apiToken={cookies().get('admin_session')?.value || ''} />`
  );
  
  // Make the wrapper responsive (padding)
  code = code.replace(
    '<div className="p-8">',
    '<div className="p-4 sm:p-8 max-w-full overflow-hidden">'
  );
  
  // Make the search bar flex direction responsive
  code = code.replace(
    '<div className="p-4 border-b flex gap-4">',
    '<div className="p-4 border-b flex flex-col sm:flex-row gap-4">'
  );
  
  // Make table responsive by wrapping in overflow-x-auto
  code = code.replace(
    '<table className="w-full text-left">',
    '<div className="overflow-x-auto w-full">\n          <table className="w-full text-left min-w-[600px]">'
  );
  
  code = code.replace(
    '</table>\n      </div>\n    </div>',
    '</table>\n        </div>\n      </div>\n    </div>'
  );
  
  // Fallback for line endings if needed
  code = code.replace(
    '</table>\r\n      </div>\r\n    </div>',
    '</table>\r\n        </div>\r\n      </div>\r\n    </div>'
  );

  fs.writeFileSync(file, code);
  console.log('Fixed invitations list responsiveness and added QuickCreate');
}
