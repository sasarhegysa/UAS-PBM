// components/TourPackage.js
import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const API = "http://193.111.124.238:5000/api";

const TourPackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API}/package`);
      setPackages(res.data);
    } catch (err) {
      console.error("Gagal mengambil data paket:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("DetailPackage", { id: item._id })}
        style={{
          backgroundColor: "white",
          marginBottom: 16,
          borderRadius: 12,
          overflow: "hidden",
          elevation: 3,
          marginHorizontal: 16,
        }}
      >
        {/* Gambar */}
        {item.destinasi?.foto ? (
          <Image
            source={{ uri: `http://193.111.124.238:5000${item.destinasi.foto}` }}
            style={{ width: "100%", height: 180 }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{ width: "100%", height: 180, justifyContent: "center", alignItems: "center", backgroundColor: "#eee" }}
          >
            <Text style={{ color: "#999" }}>No Image</Text>
          </View>
        )}

        {/* Konten */}
        <View style={{ padding: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#B91C1C" }}>{item.nama}</Text>
          <Text style={{ fontSize: 12, color: "#6B7280", fontStyle: "italic" }}>{item.durasi || "Durasi tidak tersedia"}</Text>
          <Text style={{ fontSize: 14, color: "#374151", marginVertical: 4 }}>
            {item.deskripsi?.slice(0, 100)}...
          </Text>
          <Text style={{ fontSize: 13, color: "#4B5563" }}>
            <Text style={{ fontWeight: "bold" }}>Destinasi: </Text>
            {item.destinasi?.nama || "-"}
          </Text>
          <Text style={{ fontSize: 13, color: "#4B5563" }}>
            <Text style={{ fontWeight: "bold" }}>Akomodasi: </Text>
            {item.akomodasi?.nama || "-"}
          </Text>
          <Text style={{ fontSize: 13, color: "#4B5563" }}>
            <Text style={{ fontWeight: "bold" }}>Transportasi: </Text>
            {item.transportasi?.namaOperator || item.transportasi?.operator || "-"}
          </Text>
          <Text style={{ marginTop: 6, fontSize: 16, fontWeight: "bold", color: "#15803D" }}>
            Rp{parseInt(item.harga).toLocaleString("id-ID")}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color="#EF4444" />
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 24 }}>
      <View style={{ marginBottom: 10, alignItems: "center" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "#B91C1C" }}>Paket Wisata</Text>
      </View>

      <FlatList
        data={packages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default TourPackage;
