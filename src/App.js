



import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { v4 as uuidv4 } from "uuid";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

const rawData = [
  {
    id: "1",
    name: "Google Pixel 6 Pro",
    data: { color: "Cloudy White", capacity: "128 GB" },
  },
  {
    id: "2",
    name: "Apple iPhone 12 Mini, 256GB, Blue",
    data: null,
  },
  {
    id: "3",
    name: "Apple iPhone 12 Pro Max",
    data: { color: "Cloudy White", "capacity GB": 512 },
  },
  {
    id: "4",
    name: "Apple iPhone 11, 64GB",
    data: { price: 389.99, color: "Purple" },
  },
  {
    id: "5",
    name: "Samsung Galaxy Z Fold2",
    data: { price: 689.99, color: "Brown" },
  },
  {
    id: "6",
    name: "Apple AirPods",
    data: { generation: "3rd", price: 120 },
  },
  {
    id: "7",
    name: "Apple MacBook Pro 16",
    data: {
      year: 2019,
      price: 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB",
    },
  },
  {
    id: "8",
    name: "Apple Watch Series 8",
    data: { "Strap Colour": "Elderberry", "Case Size": "41mm" },
  },
  {
    id: "9",
    name: "Beats Studio3 Wireless",
    data: {
      Color: "Red",
      Description: "High-performance wireless noise cancelling headphones",
    },
  },
  {
    id: "10",
    name: "Apple iPad Mini 5th Gen",
    data: { Capacity: "64 GB", "Screen size": 7.9 },
  },
  {
    id: "11",
    name: "Apple iPad Mini 5th Gen",
    data: { Capacity: "254 GB", "Screen size": 7.9 },
  },
  {
    id: "12",
    name: "Apple iPad Air",
    data: { Generation: "4th", Price: "419.99", Capacity: "64 GB" },
  },
  {
    id: "13",
    name: "Apple iPad Air",
    data: { Generation: "4th", Price: "519.99", Capacity: "256 GB" },
  },
];

const normalize = (product) => {
  const color =
    product.data?.color ||
    product.data?.Color ||
    product.data?.["Strap Colour"] ||
    "N/A";

  const capacity =
    product.data?.capacity ||
    product.data?.Capacity ||
    product.data?.["capacity GB"]?.toString() + " GB" ||
    "N/A";

  return { ...product, normalizedColor: color, normalizedCapacity: capacity };
};

function App() {
  const [products, setProducts] = useState([]);
  const [colorFilter, setColorFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newData, setNewData] = useState("");

  useEffect(() => {
    setProducts(rawData.map(normalize));
  }, []);

  const addProduct = () => {
    try {
      const parsed = JSON.parse(newData);
      const newProduct = normalize({
        id: uuidv4(),
        name: newName,
        data: parsed,
      });
      setProducts((prev) => [...prev, newProduct]);
      setNewName("");
      setNewData("");
    } catch (e) {
      alert("Invalid JSON data");
    }
  };

  const filtered = products.filter(
    (p) =>
      (!colorFilter || p.normalizedColor === colorFilter) &&
      (!capacityFilter || p.normalizedCapacity === capacityFilter)
  );

  const getChartData = (key) => {
    const map = {};
    filtered.forEach((p) => {
      const value = p[key];
      if (value && value !== "N/A") {
        map[value] = (map[value] || 0) + 1;
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const colors = [...new Set(products.map((p) => p.normalizedColor))];
  const capacities = [...new Set(products.map((p) => p.normalizedCapacity))];

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Product Listing with Charts</h1>

      <div className="row mb-4">
        <div className="col">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Product Name"
            className="form-control"
          />
        </div>
        <div className="col">
          <input
            value={newData}
            onChange={(e) => setNewData(e.target.value)}
            placeholder="Product Data (JSON)"
            className="form-control"
          />
        </div>
        <div className="col-auto">
          <button onClick={addProduct} className="btn btn-primary">
            Add Product
          </button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <select
            onChange={(e) => setColorFilter(e.target.value)}
            className="form-select"
          >
            <option value="">Filter by Color</option>
            {colors.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <select
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="form-select"
          >
            <option value="">Filter by Capacity</option>
            {capacities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        {filtered.map((product) => (
          <div key={product.id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{product.name}</h5>
              <p className="card-text">Color: {product.normalizedColor}</p>
              <p className="card-text">Capacity: {product.normalizedCapacity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h5 className="text-center">Product Distribution by Color</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={getChartData("normalizedColor")}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6 mb-4">
          <h5 className="text-center">Product Distribution by Capacity</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={getChartData("normalizedCapacity")}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {getChartData("normalizedCapacity").map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;

