import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Layout from "../layouts/Layout";
import SearchInput from "../components/SearchInput";
import { AuthContext } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import Table from "../components/Table";
import Map from "../components/Map";

const API = import.meta.env.VITE_API_BASE_URL || "http://geo-app.test";

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface History {
  id: number;
  ip_address: string;
}

function isValidIP(ip: string) {
  const ipv4 =
    /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d)$/;
  const ipv6 = new RegExp("^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::)$");
  return ipv4.test(ip) || ipv6.test(ip);
}

const Home = () => {
  const { token, storeIpAddress } = useContext(AuthContext);
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const [data, setData] = useState<any>(null); // current IP info
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<History[]>([]);
  const [links, setLinks] = useState<PaginationLink[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  });
  // Fetch current IP info
  const fetchCurrentInfo = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const res = await axios.get(`${API}/api/ipinfo/current`, authHeaders);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCurrentInfo();
  }, [token]);

  // Fetch history (can fetch specific page)
  const fetchHistory = async (url?: string) => {
    if (!token) return;
    setLoadingHistory(true);
    try {
      const endpoint = url || `${API}/api/ipinfo/history`;
      const res = await axios.get(endpoint, authHeaders);
      setHistory(res.data.data || []);
      setLinks(res.data.links || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [token]);

  // Delete selected IPs
  const deleteSelected = async (ids?: number[]) => {
    const toDelete = ids || selectedIds;
    if (toDelete.length === 0) return;

    try {
      const res = await axios.delete(`${API}/api/ipinfo`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: toDelete },
      });
      if (res.data.message) {
        setMessage(res.data.message);
      }

      setSelectedIds([]);
      await fetchHistory(); // refresh history
    } catch (err: any) {
      setError(err.response?.data || "Delete failed.");
    }
  };

  // Search IP
  const searchIp = async (ip?: string) => {
    const target = ip ?? input.trim();
    if (!target) return;

    setError("");
    setLoadingData(true);

    if (!isValidIP(target) && !/^[\w\.\-]+$/.test(target)) {
      setError("Not a valid IP address");
      setLoadingData(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/api/ipinfo/${target}`);
      setData(res.data);
      await storeIpAddress(target);
      await fetchHistory(); // refresh history after storing
    } catch (e: any) {
      setError(e?.response?.data?.message || "Lookup failed");
    } finally {
      setLoadingData(false);
    }
  };

  const clearSearch = async () => {
    setInput("");
    fetchCurrentInfo();
  };

  return (
    <Layout>
      <div className="toast toast-top toast-right">
        {message && (
          <div className="alert alert-success">
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
      </div>
      <div className="container mx-auto space-y-4 flex gap-4">
        <div>
          {/* Search Box */}
          <SearchInput
            placeholder="Search IP"
            onSearch={() => searchIp()}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClear={clearSearch}
          />
          {/* Result */}
          <div>
            <h3 className="text-xl">Result</h3>
            {loadingData ? (
              <Spinner />
            ) : data ? (
              <dl className="w-100 border border-gray-200">
                {[
                  { label: "IP", value: data.ip },
                  { label: "City", value: data.city },
                  { label: "Region", value: data.region },
                  { label: "Country", value: data.country },
                  { label: "Loc", value: data.loc },
                  { label: "Organization", value: data.org },
                  { label: "Postal", value: data.postal },
                  { label: "Timezone", value: data.timezone },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex py-2 px-4 justify-between text-sm border-b border-b-gray-200 hover:bg-gray-200"
                  >
                    <dt className="font-medium text-gray-500">{label}</dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <div>No data available.</div>
            )}
          </div>

          {/* History Table */}
          <div className="w-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">History</h3>
              {selectedIds.length > 0 && (
                <Button
                  toolTip="Delete"
                  onClick={() => deleteSelected(selectedIds)}
                  name="trash"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
                />
              )}
            </div>

            {loadingHistory ? (
              <Spinner />
            ) : (
              <Table
                data={history}
                onRowClick={searchIp}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                links={links}
                fetchPage={fetchHistory}
              />
            )}
          </div>
        </div>
        <div className="flex-1">
          {data?.loc && (
            <div className="my-4">
              <h3 className="text-xl mb-2">Location Map</h3>
              <Map
                lat={Number(data.loc.split(",")[0])}
                lng={Number(data.loc.split(",")[1])}
                ip={data.ip}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
