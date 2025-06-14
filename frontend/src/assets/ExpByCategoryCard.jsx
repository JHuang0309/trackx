import { useEffect, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
} from "lucide-react";
import axios from 'axios';

import { categoryIcons } from "./utils/categoryIcons";
import ExpensesPieChart from "./ExpensesPieChart";

const API_URL = import.meta.env.VITE_API_URL;

function getCategoryIcon(category) {
  if (!category) return { icon: MoreHorizontal, color: "text-gray-400" };
  const key = category.trim().toLowerCase();
  return categoryIcons[key] || { icon: MoreHorizontal, color: "text-gray-400" };
}

export default function ExpByCategoryCard({ data, isDarkMode }) {
    const [inputData, setInputData] = useState(data)
    const [categoryData, setCategoryData] = useState({});
    const [pieChartData, setPieChartData] = useState([]);
    const [monthIdx, setMonthIdx] = useState(0); // Start at latest month
    const [loading, setLoading] = useState(false);

    // Only include months in the format "Month YYYY" (e.g., "May 2025")
    const months = Object.keys(data || {}).sort(
        (a, b) => new Date(b) - new Date(a)
    );

    const currentMonth = months[monthIdx];
    const prevMonth = months[monthIdx + 1];
    const currentData = data[currentMonth] || {};
    const prevData = prevMonth ? data[prevMonth] || {} : {};

    const currentAmount = currentData.total || 0;
    const spendingCategories = currentData.spendingCategories || {};
    const prevSpendingCategories = prevData.spendingCategories || {};

    // Get all categories present this or last month
    const allCategories = Array.from(
        new Set([
        ...Object.keys(spendingCategories),
        ...Object.keys(prevSpendingCategories),
        ])
    );

    const getPieChartData = async () => {
        try {
            const response = await axios.get(`${API_URL}/cleaned_expenses`);
            const monthCategoryTotals = {};
            response.data.forEach(record => {
                if (record.Category && record.Amount > 0 && record.Month) {
                    // initialise month object if not yet made
                    if (!monthCategoryTotals[record.Month]) {
                        monthCategoryTotals[record.Month] = {};
                    }

                    monthCategoryTotals[record.Month][record.Category] =
                    (monthCategoryTotals[record.Month][record.Category] || 0) + record.Amount;
                }
            });

            Object.keys(monthCategoryTotals).forEach(month => {
                Object.keys(monthCategoryTotals[month]).forEach(category => {
                    monthCategoryTotals[month][category] = parseFloat(monthCategoryTotals[month][category].toFixed(2));
                });
            });
            setCategoryData(monthCategoryTotals);
        } catch {
            alert("Error obtaining pie chart data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPieChartData();
    }, [data])

    useEffect(() => {
        if (!categoryData || !months[monthIdx]) {
            setPieChartData([]);
            return;
        }
        const catTotals = categoryData[months[monthIdx]] || {};
        const pieData = Object.entries(catTotals).map(([category, total]) => ({
            name: category,
            value: parseFloat(total.toFixed(2)),
        }));
        setPieChartData(pieData);
    }, [monthIdx, categoryData, inputData]);

    return (
        <>
            <div className={`w-full max-w-xl mx-auto rounded-lg shadow p-3 ${isDarkMode ? 'bg-neutral-900' : 'bg-white'}`}>
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                    <span className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        Monthly Spending
                    </span>
                    <span className={`text-4xl font-bold mb-1 ${isDarkMode ? 'text-white' : ''}`}>
                        ${currentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>{currentMonth}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className={`p-2 rounded ${isDarkMode ? 'text-gray-400 hover:text-white disabled:text-gray-700 disabled:hover:text-gray-700' : 'disabled:text-gray-300 hover:text-gray-300'}`}
                            onClick={() => setMonthIdx((idx) => Math.max(0, idx - 1))}
                            disabled={monthIdx === 0}
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            className={`p-2 rounded ${isDarkMode ? 'text-gray-400 hover:text-white disabled:text-gray-700 disabled:hover:text-gray-700' : 'disabled:text-gray-300 hover:text-gray-300'}`}
                            onClick={() => setMonthIdx((idx) => Math.min(months.length - 1, idx + 1))}
                            disabled={monthIdx === months.length - 1}
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
                <div className={`my-4 ${isDarkMode ? 'border-05 border-gray-600' : 'border'}`}></div>
                <div className="flex">
                    {/* Categories */}
                    <div className="flex flex-col flex-1">
                        <h3 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : ''}`}>Spending Categories</h3>
                        <div className="flex flex-col gap-2">
                            {allCategories.map((cat) => {
                                const { icon: Icon, color, highlight, description, darkColor, darkHighlight } = getCategoryIcon(cat);
                                const spent = spendingCategories[cat] || 0;
                                const prevSpent = prevSpendingCategories[cat] || 0;
                                const diff = spent - prevSpent;
                                const percent =
                                prevSpent > 0 ? ((diff / prevSpent) * 100).toFixed(1) : null;
                                const isIncrease = diff > 0;
                                const isDecrease = diff < 0;

                                return (
                                <div key={cat} className={`flex justify-between items-center p-2 rounded-md ${isDarkMode ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'}`}>
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-10 h-10 ${isDarkMode ? `${darkColor} ${darkHighlight}` : `${color} ${highlight}`} text-blue-500 p-2 rounded-lg`} />
                                        <div className="flex flex-col">
                                            <span className={`font-semibold text-md capitalize ${isDarkMode ? 'text-white' : ''}`}>
                                                {cat.replace(/(^|\s)\S/g, (l) => l.toUpperCase())}
                                            </span>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{`${description}`}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end ">
                                        <span className={`font-semibold text-md ${isDarkMode ? 'text-white' : ''}`}>
                                            ${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        {percent !== null && (
                                            <span className={`flex items-center text-xs font-medium 
                                                ${isIncrease
                                                    ? isDecrease
                                                        ? ''
                                                        : isDarkMode
                                                            ? 'text-red-theme-dark'
                                                            : 'text-red-theme'
                                                    : isDarkMode
                                                        ? 'text-green-theme-dark'
                                                        : 'text-green-theme'
                                                }`}> 
                                                {isIncrease
                                                    ? <ArrowUpRight className="w-4 h-4 mr-0.5" />
                                                    : <ArrowDownLeft className="w-4 h-4 mr-0.5" />}
                                                {Math.abs(percent)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Pie chart */}
                    <div className="flex">
                        { pieChartData && pieChartData.length > 0 ? (
                                <ExpensesPieChart data={pieChartData} isDarkMode={isDarkMode}/>
                            ) :(
                                <div className="flex flex-col items-center justify-center">
                                    <RefreshCw className={`w-8 h-8 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                    <div className="flex items-center justify-center min-w-4md h-40 text-gray-400">Refresh page to load graph</div>
                                </div>
                                
                            )
                        }
                    </div>
                    
                </div>
                
                
            </div>
                
        </>
    );
}