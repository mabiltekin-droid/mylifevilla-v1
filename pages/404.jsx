import Layout from "../components/Layout";

export default function NotFound(){
  return (
    <Layout
      title="Sayfa bulunamadı | MyLifeVilla"
      desc="Aradığın sayfa bulunamadı. İlanlara geri dönebilirsin."
      path="/404"
    >
      <div className="card p-8">
        <div className="text-2xl font-extrabold tracking-tight">Sayfa bulunamadı</div>
        <p className="mt-2 muted">
          Link hatalı olabilir veya ilan kaldırılmış olabilir.
        </p>
        <div className="mt-6">
          <a className="btn btn-primary" href="/">İlanlara dön</a>
        </div>
      </div>
    </Layout>
  );
}
