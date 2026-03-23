const fs = require('fs');
let content = fs.readFileSync('src/app/(customer)/menu/page.tsx', 'utf8');
content = content.replace(/<EditableText/g, '<EditableText isReadOnly={true}');
fs.writeFileSync('src/app/(customer)/menu/page.tsx', content);

let content2 = fs.readFileSync('src/app/(admin)/admin/live-editor/menu/page.tsx', 'utf8');
content2 = content2.replace(/<EditableText/g, '<EditableText isReadOnly={false}');
fs.writeFileSync('src/app/(admin)/admin/live-editor/menu/page.tsx', content2);
