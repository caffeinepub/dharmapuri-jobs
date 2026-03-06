import Float "mo:core/Float";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type Degree = Text;
  type JobCategory = Text;
  type PayType = Text;
  type ApplicationStatus = { #pending; #accepted; #rejected };

  type StudentProfile = {
    name : Text;
    college : Text;
    skills : [Text];
    availability : Text;
    bio : Text;
    locationLat : Float;
    locationLng : Float;
    createdAt : Int;
  };

  type EmployerProfile = {
    businessName : Text;
    businessType : Text;
    contactNumber : Text;
    locationLat : Float;
    locationLng : Float;
    address : Text;
    createdAt : Int;
  };

  type Job = {
    id : Nat;
    employerId : Principal;
    title : Text;
    description : Text;
    category : JobCategory;
    payAmount : Nat;
    payType : PayType;
    locationLat : Float;
    locationLng : Float;
    address : Text;
    isActive : Bool;
    postedAt : Int;
    tags : [Text];
  };

  type Application = {
    id : Nat;
    jobId : Nat;
    studentId : Principal;
    status : ApplicationStatus;
    appliedAt : Int;
    message : Text;
  };

  type JobWithDistance = {
    job : Job;
    distanceKm : Float;
  };

  module JobWithDistance {
    public func compare(j1 : JobWithDistance, j2 : JobWithDistance) : Order.Order {
      Float.compare(j1.distanceKm, j2.distanceKm);
    };
  };

  type Profile = {
    #student : StudentProfile;
    #employer : EmployerProfile;
  };

  // UserProfile type required by frontend
  public type UserProfile = {
    profileType : Text; // "student" or "employer"
    name : Text;
  };

  let studentProfiles = Map.empty<Principal, StudentProfile>();
  let employerProfiles = Map.empty<Principal, EmployerProfile>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let jobs = Map.empty<Nat, Job>();
  let applications = Map.empty<Nat, Application>();

  var nextJobId = 1;
  var nextApplicationId = 1;

  // Authorization system state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  //--------------------------------------
  // USER PROFILE MANAGEMENT (Required by frontend)
  //--------------------------------------

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  //--------------------------------------
  // PROFILE MANAGEMENT
  //--------------------------------------

  public shared ({ caller }) func createStudentProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create student profiles");
    };
    if (employerProfiles.containsKey(caller)) {
      Runtime.trap("Cannot create student profile: Already have employer profile");
    };
    studentProfiles.add(caller, profile);

    // Update user profile
    let userProfile : UserProfile = {
      profileType = "student";
      name = profile.name;
    };
    userProfiles.add(caller, userProfile);
  };

  public shared ({ caller }) func createEmployerProfile(profile : EmployerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create employer profiles");
    };
    if (studentProfiles.containsKey(caller)) {
      Runtime.trap("Cannot create employer profile: Already have student profile");
    };
    employerProfiles.add(caller, profile);

    // Update user profile
    let userProfile : UserProfile = {
      profileType = "employer";
      name = profile.businessName;
    };
    userProfiles.add(caller, userProfile);
  };

  public query ({ caller }) func getMyProfile() : async ?Profile {
    let student = studentProfiles.get(caller);
    let employer = employerProfiles.get(caller);

    switch (student, employer) {
      case (?s, null) { ?#student(s) };
      case (null, ?e) { ?#employer(e) };
      case (_) { null };
    };
  };

  public shared ({ caller }) func updateStudentProfile(profile : StudentProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    if (not studentProfiles.containsKey(caller)) {
      Runtime.trap("Student profile does not exist");
    };
    studentProfiles.add(caller, profile);

    // Update user profile
    let userProfile : UserProfile = {
      profileType = "student";
      name = profile.name;
    };
    userProfiles.add(caller, userProfile);
  };

  public shared ({ caller }) func updateEmployerProfile(profile : EmployerProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    if (not employerProfiles.containsKey(caller)) {
      Runtime.trap("Employer profile does not exist");
    };
    employerProfiles.add(caller, profile);

    // Update user profile
    let userProfile : UserProfile = {
      profileType = "employer";
      name = profile.businessName;
    };
    userProfiles.add(caller, userProfile);
  };

  //--------------------------------------
  // JOB MANAGEMENT
  //--------------------------------------

  public shared ({ caller }) func postJob(job : Job) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can post jobs");
    };
    if (not employerProfiles.containsKey(caller)) {
      Runtime.trap("Only employers can post jobs");
    };

    let jobId = nextJobId;
    nextJobId += 1;

    let newJob : Job = {
      job with
      id = jobId;
      employerId = caller;
      postedAt = Time.now();
    };
    jobs.add(jobId, newJob);
    jobId;
  };

  public query ({ caller }) func getJobById(id : Nat) : async ?Job {
    jobs.get(id);
  };

  public query ({ caller }) func listJobsByEmployer(employerId : Principal) : async [Job] {
    jobs.values().toArray().filter(
      func(job : Job) : Bool { job.employerId == employerId }
    );
  };

  public query ({ caller }) func listAllActiveJobs() : async [Job] {
    jobs.values().toArray().filter(
      func(job : Job) : Bool { job.isActive }
    );
  };

  public shared ({ caller }) func deleteJob(jobId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete jobs");
    };

    let job = switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?j) { j };
    };

    if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only delete your own jobs");
    };

    jobs.remove(jobId);
  };

  //--------------------------------------
  // APPLICATION MANAGEMENT
  //--------------------------------------

  public shared ({ caller }) func applyToJob(jobId : Nat, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can apply to jobs");
    };
    if (not studentProfiles.containsKey(caller)) {
      Runtime.trap("Only students can apply to jobs");
    };

    switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?job) {
        if (not job.isActive) { Runtime.trap("Cannot apply to inactive job") };
      };
    };

    let existing = applications.values().find(
      func(app : Application) : Bool { app.jobId == jobId and app.studentId == caller }
    );
    if (switch (existing) { case (?_) { true }; case (null) { false } }) {
      Runtime.trap("Duplicate application not allowed");
    };

    let appId = nextApplicationId;
    nextApplicationId += 1;

    let newApp : Application = {
      id = appId;
      jobId;
      studentId = caller;
      status = #pending;
      appliedAt = Time.now();
      message;
    };
    applications.add(appId, newApp);
  };

  public query ({ caller }) func getMyApplications() : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view applications");
    };
    if (not studentProfiles.containsKey(caller)) {
      Runtime.trap("Only students can view their applications");
    };

    applications.values().toArray().filter(
      func(app : Application) : Bool { app.studentId == caller }
    );
  };

  public query ({ caller }) func getApplicationsForJob(jobId : Nat) : async [Application] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view applications");
    };

    let job = switch (jobs.get(jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?j) { j };
    };

    if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view applications for your own jobs");
    };

    applications.values().toArray().filter(
      func(app : Application) : Bool { app.jobId == jobId }
    );
  };

  public shared ({ caller }) func updateApplicationStatus(appId : Nat, status : ApplicationStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update application status");
    };

    let app = switch (applications.get(appId)) {
      case (null) { Runtime.trap("Application not found") };
      case (?a) { a };
    };

    let job = switch (jobs.get(app.jobId)) {
      case (null) { Runtime.trap("Job not found") };
      case (?j) { j };
    };

    if (job.employerId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update applications for your own jobs");
    };

    let updatedApp = { app with status };
    applications.add(appId, updatedApp);
  };

  //--------------------------------------
  // GEO QUERY - HAVERSINE LOGIC
  //--------------------------------------

  func haversine(lat1 : Float, lon1 : Float, lat2 : Float, lon2 : Float) : Float {
    let dLat = (lat2 - lat1) * Float.pi / 180.0;
    let dLon = (lon2 - lon1) * Float.pi / 180.0;

    let a = Float.sin(dLat / 2.0) * Float.sin(dLat / 2.0)
      + Float.cos(lat1 * Float.pi / 180.0)
      * Float.cos(lat2 * Float.pi / 180.0)
      * Float.sin(dLon / 2.0) * Float.sin(dLon / 2.0);

    let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
    6371.0 * c; // Radius of earth in km
  };

  public query ({ caller }) func getJobsNearLocation(lat : Float, lng : Float, radiusKm : Float) : async [JobWithDistance] {
    let activeJobs = jobs.values().toArray().filter(
      func(job : Job) : Bool { job.isActive }
    );

    let jobsWithDistance = activeJobs.map(
      func(job : Job) : JobWithDistance {
        {
          job;
          distanceKm = haversine(lat, lng, job.locationLat, job.locationLng);
        };
      }
    );

    let filtered = jobsWithDistance.filter(
      func(jwd : JobWithDistance) : Bool { jwd.distanceKm <= radiusKm }
    );

    filtered.sort();
  };

  //--------------------------------------
  // SEED DATA
  //--------------------------------------

  public shared ({ caller }) func initSeedData() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize seed data");
    };

    let employers = [
      {
        businessName = "Sathya's Tea Stall";
        businessType = "Cafe";
        contactNumber = "9566986521";
        locationLat = 12.125;
        locationLng = 78.159;
        address = "Perumal Street, Dharmapuri, TN";
        createdAt = Time.now();
      },
      {
        businessName = "Karthik Bakery";
        businessType = "Bakery";
        contactNumber = "9831913333";
        locationLat = 12.130;
        locationLng = 78.162;
        address = "Bus Stand Road, Dharmapuri, TN";
        createdAt = Time.now();
      },
      {
        businessName = "Sri Tuition Center";
        businessType = "Education";
        contactNumber = "8756986542";
        locationLat = 12.127;
        locationLng = 78.158;
        address = "New Town Circle, Dharmapuri, TN";
        createdAt = Time.now();
      },
      {
        businessName = "Veggie Cart";
        businessType = "Retail";
        contactNumber = "9786139331";
        locationLat = 12.122;
        locationLng = 78.155;
        address = "Rajaji Road, Dharmapuri, TN";
        createdAt = Time.now();
      },
    ];

    let jobsSeed = [
      {
        title = "Tea Shop Helper";
        description = "Assist with serving and cleaning at tea stall";
        category = "F&B";
        payAmount = 160;
        payType = "per day";
        locationLat = 12.125;
        locationLng = 78.159;
        address = "Perumal Street";
        tags = ["helper", "tea", "service"];
      },
      {
        title = "Bakery Assistant";
        description = "Support bakery operations and sales in store";
        category = "Bakery";
        payAmount = 200;
        payType = "per day";
        locationLat = 12.130;
        locationLng = 78.162;
        address = "Bus Stand Road";
        tags = ["bakery", "sales"];
      },
      {
        title = "Tuition Assistant";
        description = "Provide teaching support at tuition center";
        category = "Education";
        payAmount = 300;
        payType = "per day";
        locationLat = 12.127;
        locationLng = 78.158;
        address = "New Town Circle";
        tags = ["tuition", "education"];
      },
      {
        title = "Delivery Executive";
        description = "Handle local food deliveries";
        category = "Delivery";
        payAmount = 400;
        payType = "per day";
        locationLat = 12.122;
        locationLng = 78.155;
        address = "Rajaji Road";
        tags = ["delivery", "driver"];
      },
      {
        title = "Bakery Sales Support";
        description = "Retail sales for bakery items";
        category = "Bakery";
        payAmount = 160;
        payType = "part-time";
        locationLat = 12.127;
        locationLng = 78.158;
        address = "Station Road";
        tags = ["bakery", "sales"];
      },
      {
        title = "Tea Shop Helper";
        description = "Tea making and cleaning at stall";
        category = "F&B";
        payAmount = 180;
        payType = "per day";
        locationLat = 12.130;
        locationLng = 78.162;
        address = "Wellington Road";
        tags = ["helper", "tea", "service"];
      },
      {
        title = "Tutoring English";
        description = "Tutor for College English Subjects";
        category = "Education";
        payAmount = 250;
        payType = "per hour";
        locationLat = 12.122;
        locationLng = 78.155;
        address = "College Road";
        tags = ["tutor", "english"];
      },
      {
        title = "Vegetable Delivery";
        description = "Deliver fresh vegetable orders";
        category = "Delivery";
        payAmount = 300;
        payType = "per day";
        locationLat = 12.125;
        locationLng = 78.159;
        address = "Market Area";
        tags = ["delivery", "driver"];
      },
    ];

    let seedPrincipals = [
      Principal.fromText("ale2n-digni-77w4s-hmsqe-dg43h-mn4r5-l3vrm-f3gdv-6a345-kl36a-vqe"),
      Principal.fromText("zxssk-uopnc-vmglc-u7onk-khuax-txb3o-tj7bh-pgufx-q6ji7-kuozd-gae"),
      Principal.fromText("3cus3-nmexl-63gnj-pjhld-44c7s-sjxwu-hjnsh-7opbz-3vmyo-qgyw5-oge"),
      Principal.fromText("p3ioh-2yqy6-htkcd-5f3uf-d4uis-5zvc2-kr3fh-cg4k4-eyhtd-4v5ag-cae"),
    ];

    // Add employers and jobs
    for ((index, employer) in employers.enumerate()) {
      employerProfiles.add(seedPrincipals[index], employer);

      let userProfile : UserProfile = {
        profileType = "employer";
        name = employer.businessName;
      };
      userProfiles.add(seedPrincipals[index], userProfile);

      // Jobs 2 per employer
      jobs.add(
        nextJobId,
        {
          jobsSeed[index * 2] with
          id = nextJobId;
          employerId = seedPrincipals[index];
          postedAt = Time.now();
          isActive = true;
        },
      );
      nextJobId += 1;

      jobs.add(
        nextJobId,
        {
          jobsSeed[index * 2 + 1] with
          id = nextJobId;
          employerId = seedPrincipals[index];
          postedAt = Time.now();
          isActive = true;
        },
      );
      nextJobId += 1;
    };
  };
};
