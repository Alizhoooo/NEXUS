import React from 'react';
import { PERFORMANCE } from '../constants';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { Star } from 'lucide-react';

const Performance: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Performance Reviews</h2>
          <span className="text-sm text-slate-500">Q4 2025 Cycle</span>
       </div>

       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {PERFORMANCE.map(review => {
             // Transform metrics for radar chart
             const data = Object.keys(review.metrics).map(key => ({
                 subject: key.charAt(0).toUpperCase() + key.slice(1),
                 A: review.metrics[key as keyof typeof review.metrics],
                 fullMark: 100
             }));

             return (
                 <div key={review.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                        <div className="flex items-center mb-6">
                            <img src={review.avatar} alt="" className="w-16 h-16 rounded-full mr-4 border-2 border-slate-100" />
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{review.employeeName}</h3>
                                <p className="text-slate-500 text-sm">{review.role} • {review.department}</p>
                                <div className="flex items-center mt-1">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < Math.round(review.overallScore) ? 'fill-current' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm font-bold text-slate-700">{review.overallScore}/5.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Strengths</p>
                                <div className="flex flex-wrap gap-2">
                                    {review.strengths.map(s => (
                                        <span key={s} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Areas for Improvement</p>
                                <div className="flex flex-wrap gap-2">
                                    {review.improvements.map(s => (
                                        <span key={s} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-md border border-orange-100">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-6 md:w-80 border-l border-slate-100 flex items-center justify-center">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar name={review.employeeName} dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                 </div>
             )
          })}
       </div>
    </div>
  );
};

export default Performance;