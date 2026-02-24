
const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">

        {/* Pattern Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-primary/10 transition-all duration-300 hover:bg-primary/20"
            />
          ))}
        </div>

        {/* Text */}
        <h2 className="text-3xl font-bold mb-4">
          {title}
        </h2>

        <p className="text-base-content/60 leading-relaxed">
          {subtitle}
        </p>

      </div>
    </div>
  );
};

export default AuthImagePattern;