<% layout('/layouts/boilerplate.ejs') -%>
<link rel="stylesheet" href="/css/style.css">

<div class="booking-details">
  <h2>Booking: <%= listing.title %></h2>
  <p><strong>Price:</strong> &#8377; <%= listing.price.toLocaleString("en-IN") %> /night</p>
  <p><strong>Description:</strong> <%= listing.description %></p>

  <!-- Booking Form -->
  <form action="/bookings/confirm/<%= listing._id %>" method="POST">
    <div class="mb-3">
      <label for="checkin" class="form-label">Check-in Date:</label>
      <input type="date" id="checkin" name="checkin" class="form-control" required>
    </div>
    
    <div class="mb-3">
      <label for="checkout" class="form-label">Check-out Date:</label>
      <input type="date" id="checkout" name="checkout" class="form-control" required>
    </div>

    <button type="submit" class="btn btn-primary">Confirm Booking</button>
  </form>
</div>
