import Layout from "../components/Layout";

export default function Thanks(){
  return (
    <Layout title="Teşekkürler | MyLifeVilla" desc="Talebin alındı." path="/thanks">
      <div className="card p-8 page-text">
        <div className="text-2xl font-extrabold tracking-tight">Teşekkürler ✅</div>
        <p className="mt-2 muted">Ziyaret talebin alındı. En kısa sürede geri dönüş yapacağız.</p>
        <div className="mt-6 flex gap-2">
          <a className="btn btn-primary" href="/">İlanlara dön</a>
          <a className="btn" href="/favorites">Favoriler</a>
        </div>
      </div>
    </Layout>
  );
}
