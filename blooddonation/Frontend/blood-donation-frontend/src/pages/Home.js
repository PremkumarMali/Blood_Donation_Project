function Home() {

  return (
    <div className="container mt-5 text-center">

      <h1>Blood Donation System</h1>

      <div className="row mt-5">

        <div className="col-md-4">
          <button className="btn btn-danger w-100">
            Become Donor
          </button>
        </div>

        <div className="col-md-4">
          <button className="btn btn-primary w-100">
            Request Blood
          </button>
        </div>

        <div className="col-md-4">
          <button className="btn btn-dark w-100">
            Blood Bank
          </button>
        </div>

      </div>

    </div>
  );
}

export default Home;