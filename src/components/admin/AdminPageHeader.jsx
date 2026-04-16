import { motion } from 'framer-motion';

const AdminPageHeader = ({ title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex items-start justify-between mb-8"
  >
    <div>
      <h1 className="font-display font-bold text-2xl text-[#EEF5F1] mb-1">{title}</h1>
      {description && <p className="text-sm text-[#6B9980]">{description}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </motion.div>
);

export default AdminPageHeader;