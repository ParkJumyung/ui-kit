// app/components/Sidebar.tsx
import Link from "next/link";

interface SidebarProps {
  subfolders: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ subfolders }) => {
  return (
    <div className="bg-greyLight h-full absolute left-0 flex flex-col p-6 text-white">
      <h2 className="text-lg font-bold text-text mb-4">Getting Started</h2>
      <ul>
        <li className="text-text flex justify-center px-4 py-2 rounded hover:bg-greyDark">
          Guide
        </li>
      </ul>
      <h2 className="text-lg font-bold text-text mb-4">Installation</h2>
      <ul>
        <li className="text-text flex justify-center px-4 py-2 rounded hover:bg-greyDark">
          Nextjs
        </li>
      </ul>
      <h2 className="text-lg font-bold text-text mb-4">Components</h2>
      <ul className="divide-y-2 divide-greyBorder">
        {subfolders.map((folder) => (
          <li key={folder}>
            <Link
              className="text-text justify-center flex px-4 py-2 rounded hover:bg-greyDark"
              href={`http://localhost:3000/docs/components/${folder}`}
            >
              {folder}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
