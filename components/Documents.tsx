import React from 'react';
import { DOCUMENTS } from '../constants';
import { FileText, Download, MoreHorizontal, UploadCloud } from 'lucide-react';

const Documents: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Company Documents</h2>
          <p className="text-slate-500 text-sm">Centralized knowledge base for Kolesa Group</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload New
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCUMENTS.map((doc) => (
            <div key={doc.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:border-primary-300 transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        doc.type === 'PDF' ? 'bg-red-50 text-red-600' :
                        doc.type === 'DOCX' ? 'bg-blue-50 text-blue-600' :
                        doc.type === 'FIGMA' ? 'bg-purple-50 text-purple-600' :
                        doc.type === 'XLSX' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                        <FileText className="w-5 h-5" />
                    </div>
                    <button className="text-slate-300 hover:text-slate-600">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
                <h3 className="font-semibold text-slate-900 truncate mb-1" title={doc.name}>{doc.name}</h3>
                <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
                    <span>{doc.size}</span>
                    <span>{doc.updatedAt}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500">By {doc.author}</span>
                    <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-primary-600 transition-colors">
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;